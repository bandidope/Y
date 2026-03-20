import {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  Browsers
} from "@whiskeysockets/baileys"
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import { makeWASocket } from '@whiskeysockets/baileys'
import { smsg } from '../lib/simple.js'
import { handler, loadEvents } from '../handler.js'
import { database } from '../lib/database.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

if (!Array.isArray(global.conns)) global.conns = []

const MAX_SUBBOTS = 15
const MAX_PER_USER = 2
const COOLDOWN_MS = 120000

// ─────── ESTÉTICA ZERO TWO ───────
const prefixZT = '🌸 𝐙𝐞𝐫𝐨-𝐓𝐰𝐨'

const generarMensajeCodigo = (nombre, codigo) => `${prefixZT} 🌸

Darling 💞, aquí tienes tu *Código de Vinculación* de 8 dígitos:

👤 Usuario: ${nombre}
🔑 Código: \`\`\`${codigo}\`\`\`

✨ *Pasos para vincular:*
1️⃣ Abre WhatsApp en tu celular
2️⃣ Toca los 3 puntitos > Dispositivos vinculados
3️⃣ Toca "Vincular un dispositivo"
4️⃣ Elige "Vincular con número de teléfono"
5️⃣ Ingresa el código de arriba

⚠️ *Expira en 45 segundos.* ¡Úsalo rápido, Darling! 💕`

const generarMensajeQR = (nombre) => `${prefixZT} 🌸

Darling 💞, escanea este *Código QR* para conectarte:

👤 Usuario: ${nombre}

📱 *Pasos:*
1️⃣ Abre WhatsApp
2️⃣ Toca los 3 puntitos > Dispositivos vinculados
3️⃣ Toca "Vincular un dispositivo"
4️⃣ Escanea la imagen de abajo

⚠️ *Expira en 45 segundos.*

¡Conéctate ya, mi Darling! 🌸💕`

const generarMensajeExito = (nombre, metodo) => `${prefixZT} 🌸

¡Conexión *exitosa*, Darling! 💞🎉

👤 Usuario: ${nombre}
⚙️ Método: *${metodo}*
🌐 Sistema: ${metodo === 'Código' ? 'Chrome · MacOS' : 'Safari · MacOS'}

🌟 *Ya puedes usar todos mis comandos* desde tu número.
¡Bienvenido al club Zero-Two! 💕`

// ─────── FUNCIONES AUXILIARES ───────
function cleanPhoneNumber(phone) {
  if (!phone) return null
  const cleaned = phone.replace(/[^0-9]/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15 ? cleaned : null
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  return `\( {hours.toString().padStart(2, '0')}: \){minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function isSocketReady(sock) {
  if (!sock) return false
  const hasWs = sock.ws?.socket?.readyState === 1
  const hasUser = sock.user?.jid
  return hasWs && hasUser
}

// ─────── LIMPIEZA DE MEMORIA ───────
setInterval(() => {
  try {
    if (!global.conns.length) return
    const before = global.conns.length
    global.conns = global.conns.filter(conn => {
      if (!conn || !conn.user || !isSocketReady(conn)) {
        try {
          conn?.ws?.close()
          conn?.ev?.removeAllListeners()
        } catch {}
        return false
      }
      return true
    })
    const removed = before - global.conns.length
    if (removed > 0) console.log(chalk.red(`[Zero-Two] 🧹 Limpiados ${removed} SubBots inactivos.`))
  } catch (error) {
    console.error(chalk.red(`[Zero-Two] ❌ Error en limpieza:`, error.message))
  }
}, 60000)

// ─────── EJECUCIÓN DEL COMANDO ───────
let pluginHandler = async (m, { conn, args, prefix, command }) => {
  const userId = m.sender
  const now = Date.now()

  if (!database.data.users[userId]) database.data.users[userId] = {}
  if (!database.data.users[userId].Subs) database.data.users[userId].Subs = 0

  const lastUse = database.data.users[userId].Subs

  if (now - lastUse < COOLDOWN_MS) {
    const remaining = msToTime(COOLDOWN_MS - (now - lastUse))
    return m.reply(`${prefixZT} 🌸\n\nDarling, ve más despacio. Espera ${remaining} para volver a intentarlo.`)
  }

  const activeCount = global.conns.filter(c => isSocketReady(c)).length
  if (activeCount >= MAX_SUBBOTS) {
    return m.reply(`\( {prefixZT} 🌸\n\nLo siento Darling, el límite de SubBots está lleno ( \){activeCount}/${MAX_SUBBOTS}).`)
  }

  const userPhone = cleanPhoneNumber(m.sender)
  if (userPhone) {
    const userCount = global.conns.filter(c =>
      isSocketReady(c) && cleanPhoneNumber(c.user?.jid) === userPhone
    ).length

    if (userCount >= MAX_PER_USER) {
      return m.reply(`\( {prefixZT} 🌸\n\nYa tienes el máximo de sesiones permitidas ( \){userCount}/${MAX_PER_USER}).\nUsa ${prefix}stop para apagar una.`)
    }
  }

  const sessionId = m.sender.split('@')[0]
  const sessionPath = path.join('./Sessions/SubBots', sessionId)

  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true })
  }

  database.data.users[userId].Subs = now

  const useCode = command === 'code'

  await startSubBot({ m, conn, args, prefix, sessionPath, useCode })
}

pluginHandler.help = ['code', 'qr', 'serbot']
pluginHandler.tags = ['serbot']
pluginHandler.command = ['code', 'qr', 'serbot']

export default pluginHandler

// ─────── LÓGICA DEL SUBBOT ───────
async function startSubBot({ m, conn, args, prefix, sessionPath, useCode }) {
  const sessionId = path.basename(sessionPath)
  const metodoUsado = useCode ? 'Código' : 'QR'
  let txtCode, txtQR

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const { version } = await fetchLatestBaileysVersion()
    const msgRetryCache = new NodeCache()

    const connectionOptions = {
      version,
      logger: pino({ level: 'fatal' }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
      },
      msgRetryCache,
      browser: useCode ? Browsers.macOS('Chrome') : Browsers.macOS('Safari'),
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: false,
      syncFullHistory: false,
      getMessage: async () => '',
      keepAliveIntervalMs: 45000
    }

    const sock = makeWASocket(connectionOptions)
    sock.sessionPath = sessionPath

    let authSent = false   // ← Evita envíos múltiples

    sock.ev.on('connection.update', async update => {
      const { connection, lastDisconnect, qr } = update

      let nombreUsuario = m.pushName || 'Darling'
      try {
        nombreUsuario = await conn.getName(m.sender) || nombreUsuario
      } catch {}

      // ─────── ENVÍO DE CÓDIGO O QR (solo una vez) ───────
      if (qr && !authSent) {
        authSent = true

        if (!useCode) {
          // === MÉTODO QR ===
          txtQR = await conn.sendMessage(m.chat, {
            image: await qrcode.toBuffer(qr, { scale: 10 }),
            caption: generarMensajeQR(nombreUsuario)
          }, { quoted: m })

          if (txtQR?.key) {
            setTimeout(() => conn.sendMessage(m.chat, { delete: txtQR.key }).catch(() => {}), 45000)
          }
        } else {
          // === MÉTODO CÓDIGO 8 DÍGITOS ===
          try {
            let secret = await sock.requestPairingCode(m.sender.split('@')[0])
            secret = secret?.match(/.{1,4}/g)?.join('-') || secret

            const mensajeCodigo = generarMensajeCodigo(nombreUsuario, secret)
            txtCode = await conn.sendMessage(m.chat, { text: mensajeCodigo }, { quoted: m })

            console.log(chalk.bold.magentaBright(`\n[Zero-Two] 🌸 Código de 8 dígitos para ${nombreUsuario}: ${secret}\n`))

            if (txtCode?.key) {
              setTimeout(() => conn.sendMessage(m.chat, { delete: txtCode.key }).catch(() => {}), 45000)
            }
          } catch (e) {
            console.error(chalk.red(`[Zero-Two] ❌ Error generando código:`, e.message))
          }
        }
        return
      }

      // ─────── CONEXIÓN EXITOSA ───────
      if (connection === 'open') {
        console.log(chalk.greenBright(`\n[Zero-Two] 🌸 \( {nombreUsuario} (+ \){sessionId}) se unió. Método: ${metodoUsado}`))

        sock.startTime = Date.now()
        await loadEvents(sock).catch(() => {})

        const idx = global.conns.findIndex(c => c.sessionPath === sessionPath)
        if (idx !== -1) global.conns.splice(idx, 1)
        global.conns.push(sock)

        console.log(chalk.cyanBright(`[Zero-Two] 📊 Total subbots activos: ${global.conns.length}`))

        await conn.sendMessage(m.chat, {
          text: generarMensajeExito(nombreUsuario, metodoUsado)
        }, { quoted: m }).catch(() => {})
      }

      // ─────── DESCONEXIÓN ───────
      if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode
        global.conns = global.conns.filter(c => c.sessionPath !== sessionPath)

        if ([DisconnectReason.connectionLost, DisconnectReason.connectionClosed, DisconnectReason.restartRequired, DisconnectReason.timedOut, DisconnectReason.badSession].includes(reason)) {
          console.log(chalk.yellow(`\n[Zero-Two] 🔄 Reconectando (+${sessionId})... Razón: ${reason}`))
          setTimeout(() => startSubBot({ m, conn, args, prefix, sessionPath, useCode }), 3000)
        } else if ([DisconnectReason.loggedOut, DisconnectReason.forbidden].includes(reason)) {
          console.log(chalk.redBright(`\n[Zero-Two] 💔 Sesión (+${sessionId}) cerrada. Limpiando archivos...`))
          fs.rmSync(sessionPath, { recursive: true, force: true })
        } else if (reason === 440) {
          console.log(chalk.blue(`\n[Zero-Two] ⚠️ Sesión (+${sessionId}) reemplazada.`))
        } else {
          console.log(chalk.yellow(`\n[Zero-Two] ❓ Caída desconocida (+${sessionId}): ${reason}`))
          setTimeout(() => startSubBot({ m, conn, args, prefix, sessionPath, useCode }), 3000)
        }
      }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      try {
        if (type !== 'notify') return
        let msg = messages[0]
        if (!msg?.message) return
        if (Object.keys(msg.message)[0] === 'ephemeralMessage') {
          msg.message = msg.message.ephemeralMessage.message
        }
        if (msg.key?.remoteJid === 'status@broadcast') return
        if (msg.key?.id?.startsWith('BAE5') && msg.key.id.length === 16) return

        msg = smsg(sock, msg)
        await handler(msg, sock, global.plugins)
      } catch (e) {
        console.error(chalk.red(`[Zero-Two] ❌ Error en handler [${sessionId}]:`), e.message)
      }
    })

  } catch (error) {
    console.error(chalk.red(`[Zero-Two] ❌ Error crítico en [${sessionId}]: ${error.message}`))
    await m.reply(`${prefixZT} 🌸\n\nDarling, hubo un error al crear la sesión.\nDetalle: ${error.message}`)
  }
}