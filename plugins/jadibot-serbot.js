import fs from "fs"
import path from "path"
import pino from "pino"
import chalk from "chalk"
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
  DisconnectReason
} from "@whiskeysockets/baileys"

import { smsg } from "../lib/simple.js"
import { handler as mainHandler } from "../handler.js"

if (!Array.isArray(global.conns)) global.conns = []
if (!global.subLocks) global.subLocks = new Map()

const SUBBOT_DIR = "Sessions/SubBots"
const MAX_SUBBOTS = 5
const PAIRING_TIMEOUT = 120000

function normalizePhone(input) {
  if (!input) return null
  let num = input.replace(/[\s\-().]/g, "")
  if (num.startsWith("+")) num = num.slice(1)
  if (!/^\d+$/.test(num)) return null
  if (num.length < 8 || num.length > 15) return null
  return num
}

async function handler(m, { conn, args, plugins }) {
  const text = args.join(" ")

  if (!text?.startsWith("+")) return m.reply("Ejemplo: .code +521234567890")

  if (global.conns.length >= MAX_SUBBOTS) {
    return m.reply("⚠️ Límite de subbots alcanzado")
  }

  const number = normalizePhone(text)
  if (!number) return m.reply("❌ Número inválido")

  if (global.subLocks.get(number)) {
    return m.reply("⏳ Ya se está generando un código para ese número")
  }

  global.subLocks.set(number, true)

  const sessionPath = path.join(SUBBOT_DIR, number)
  fs.mkdirSync(sessionPath, { recursive: true })

  const msg = await m.reply(`🔄 Generando código para +${number}...`)

  startSubBot(sessionPath, number, m, conn, msg, plugins)
}

handler.help = ["code"]
handler.tags = ["serbot"]
handler.command = ["code", "serbot"]

export default handler


async function startSubBot(sessionPath, number, m, conn, msg, plugins) {
  let connected = false
  let timeout

  const clean = () => {
    try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch {}
    global.subLocks.delete(number)
    global.conns = global.conns.filter(c => c.sessionPath !== sessionPath)
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      version,
      logger: pino({ level: "silent" }),
      browser: Browsers.macOS("Chrome"),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys)
      }
    })

    sock.sessionPath = sessionPath

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return
      let msg = messages[0]
      if (!msg?.message) return

      if (Object.keys(msg.message)[0] === "ephemeralMessage") {
        msg.message = msg.message.ephemeralMessage.message
      }

      msg = await smsg(sock, msg)

      await mainHandler(msg, sock, plugins)
    })

    setTimeout(async () => {
      try {
        if (!state.creds.registered) {
          let code = await sock.requestPairingCode(number)
          code = code.match(/.{1,4}/g)?.join("-") || code

          await conn.sendMessage(m.chat, {
            text: `🔑 Código para +${number}:\n${code}`
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
        m.reply(`❌ Error:\n${e.message}`)
      }
    }, 3000)

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      const reason = lastDisconnect?.error?.output?.statusCode

      if (connection === "open") {
        connected = true
        clearTimeout(timeout)

        global.subLocks.delete(number)
        global.conns.push(sock)

        await conn.sendMessage(m.chat, {
          text: `✅ Subbot conectado: +${number}`
        }, { quoted: m })

        console.log(chalk.green(`Subbot conectado: +${number}`))
      }

      if (connection === "close") {
        if ([DisconnectReason.loggedOut, DisconnectReason.forbidden].includes(reason)) {
          clean()
        }
      }
    })

  } catch (e) {
    clean()
    m.reply(`❌ Error iniciando subbot:\n${e.message}`)
  }
}