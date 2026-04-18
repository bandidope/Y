import fs from "fs"
import path from "path"
import pino from "pino"
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
  DisconnectReason
} from "@whiskeysockets/baileys"

import { smsg } from "../lib/simple.js"
import { handler as msgHandler } from "../handler.js"

if (!Array.isArray(global.conns)) global.conns = []
if (!global.subLocks) global.subLocks = new Map()

const MAX_SUBBOTS = 15
const MAX_PER_USER = 2
const SUBBOT_DIR = global.subBotsDir || "./Sessions/SubBots"
const PAIRING_TIMEOUT = 120000

function isSocketReady(sock) {
  return sock?.ws?.socket?.readyState === 1 && !!sock?.user?.jid
}

function cleanPhone(jid) {
  return jid?.replace(/[^0-9]/g, "") || null
}

const handler = async (m, { conn, prefix }) => {
  const userPhone = cleanPhone(m.sender)

  const active = global.conns.filter(isSocketReady).length
  if (active >= MAX_SUBBOTS) {
    return m.reply(`◇ Límite alcanzado\n✧ ${active}/${MAX_SUBBOTS}`)
  }

  if (userPhone) {
    const count = global.conns.filter(c =>
      isSocketReady(c) && cleanPhone(c.user?.jid) === userPhone
    ).length

    if (count >= MAX_PER_USER) {
      return m.reply(`◇ Máximo alcanzado\n✧ ${count}/${MAX_PER_USER}\n› usa ${prefix}stop`)
    }
  }

  const number = m.sender.split("@")[0]

  if (global.subLocks.get(number)) {
    return m.reply("⏳ Ya se está generando un código para ese número")
  }

  global.subLocks.set(number, true)

  const sessionPath = path.join(SUBBOT_DIR, number)
  fs.mkdirSync(sessionPath, { recursive: true })

  await m.reply(`◇ Generando código para +${number}...`)

  startSubBot(sessionPath, number, m, conn, true)
}

handler.help = ["code"]
handler.tags = ["serbot"]
handler.command = ["code", "serbot"]

export default handler

async function startSubBot(sessionPath, number, m, conn, isNew = false) {
  let retry = 0
  let connected = false
  let timeout

  const clean = () => {
    try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch {}
    global.subLocks.delete(number)
    global.conns = global.conns.filter(c => c.sessionPath !== sessionPath)
  }

  const start = async () => {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
      const { version } = await fetchLatestBaileysVersion()
      const logger = pino({ level: "silent" })

      const sock = makeWASocket({
        version,
        logger,
        browser: Browsers.macOS("Chrome"),
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        markOnlineOnConnect: false,
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        keepAliveIntervalMs: 15000,
        connectTimeoutMs: 10000
      })

      sock.sessionPath = sessionPath

      sock.ev.on("creds.update", saveCreds)

      sock.ws.on("CB:ib,,dirty", async () => {
        try { await sock.ws.close() } catch {}
      })

      sock.ev.on("messages.upsert", async ({ messages, type }) => {
        try {
          if (type !== "notify") return
          let msg = messages[0]
          if (!msg?.message) return

          if (Object.keys(msg.message)[0] === "ephemeralMessage") {
            msg.message = msg.message.ephemeralMessage.message
          }

          if (msg.key?.remoteJid === "status@broadcast") return
          if (msg.key?.id?.startsWith("BAE5") && msg.key.id.length === 16) return

          msg = smsg(sock, msg)
          await msgHandler(msg, sock, global.plugins)
        } catch {}
      })

      if (isNew) {
        setTimeout(async () => {
          try {
            if (!state.creds.registered) {
              let code = await sock.requestPairingCode(number)
              code = code.match(/.{1,4}/g)?.join("-") || code

              await conn.sendMessage(m.chat, {
                text: `◆ Vinculación\n\n✧ Número › +${number}\n\nIngresa este código:\n\n🔑 ${code}`
              }, { quoted: m })

              timeout = setTimeout(() => {
                if (!connected) {
                  clean()
                  conn.sendMessage(m.chat, {
                    text: "⏰ Tiempo agotado, sesión eliminada"
                  }, { quoted: m })
                }
              }, PAIRING_TIMEOUT)
            }
          } catch (e) {
            clean()
            conn.sendMessage(m.chat, {
              text: `❌ Error generando código\n${e.message}`
            }, { quoted: m })
          }
        }, 3000)
      }

      sock.ev.on("connection.update", async update => {
        const { connection, lastDisconnect } = update
        const reason = lastDisconnect?.error?.output?.statusCode

        if (connection === "open") {
          connected = true
          clearTimeout(timeout)

          global.subLocks.delete(number)

          const i = global.conns.findIndex(c => c.sessionPath === sessionPath)
          if (i !== -1) global.conns.splice(i, 1)

          global.conns.push(sock)

          if (m) {
            await conn.sendMessage(m.chat, {
              text: `✅ SubBot conectado: +${number}`
            }, { quoted: m })
          }
        }

        if (connection === "close") {
          global.conns = global.conns.filter(c => c.sessionPath !== sessionPath)

          if ([DisconnectReason.loggedOut, DisconnectReason.forbidden].includes(reason)) {
            clean()
            return
          }

          if (reason === DisconnectReason.badSession) {
            clean()
            return
          }

          if (retry >= 5) {
            clean()
            return
          }

          retry++
          setTimeout(start, 2000)
        }
      })

    } catch (e) {
      clean()
      if (m) {
        conn.sendMessage(m.chat, {
          text: `❌ Error iniciando subbot\n${e.message}`
        }, { quoted: m })
      }
    }
  }

  start()
}