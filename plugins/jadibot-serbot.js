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

// --- MENSAJES ESTÉTICOS ---
const generarMensajeCodigo = (nombre) => `✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n  ◆ ¡Hola, ${nombre}!\n  ✧ Método › Código de ocho dígitos\n\n› Ve a Dispositivos vinculados\n› Vincular con número de teléfono\n› Ingresa el código que enviaré abajo:`

const generarMensajeQR = (nombre) => `✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n  ◆ Bienvenido, ${nombre}\n  ✧ Método › Código QR\n\n› Escanea el código para conectar.\n◇ Expira en 45 segundos.`

const generarMensajeExito = (nombre, metodo) => `✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n  ◆ ¡Conexión Exitosa!\n\n  ✧ Usuario  › ${nombre}\n  ✧ Método   › ${metodo}\n\n› Ya puedes usar los comandos.`

// --- FUNCIONES DE APOYO ---
function cleanPhoneNumber(phone) {
  if (!phone) return null
  return phone.replace(/[^0-9]/g, '')
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// --- LIMPIEZA AUTOMÁTICA ---
setInterval(() => {
  global.conns = global.conns.filter(conn => {
    if (!conn.ws || conn.ws.readyState !== 1) {
      try { conn.ev.removeAllListeners(); conn.ws.close() } catch {}
      return false
    }
    return true
  })
}, 60000)

let pluginHandler = async (m, { conn, prefix }) => {
  const userId = m.sender
  const now = Date.now()

  if (!database.data.users[userId]) database.data.users[userId] = {}
  if (!database.data.users[userId].lastSub) database.data.users[userId].lastSub = 0

  // Cooldown
  if (now - database.data.users[userId].lastSub < COOLDOWN_MS) {
    return m.reply(`✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n◇ Espera ${msToTime(COOLDOWN_MS - (now - database.data.users[userId].lastSub))} para reintentar.`)
  }

  const activeCount = global.conns.length
  if (activeCount >= MAX_SUBBOTS) return m.reply('✦ Límite de SubBots alcanzado.')

  const sessionId = m.sender.split('@')[0]
  const sessionPath = path.join('./Sessions/SubBots', sessionId)

  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })

  database.data.users[userId].lastSub = now
  
  // Determinar si es comando #code o #serbot
  const isCode = m.text.includes('code')

  await startSubBot({ m, conn, sessionPath, isCode })
}

pluginHandler.command = ['code', 'serbot']
export default pluginHandler

async function startSubBot({ m, conn, sessionPath, isCode }) {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()
  
  const connectionOptions = {
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    browser: isCode ? ["Ubuntu", "Chrome", "20.0.04"] : Browsers.macOS('Safari'),
    syncFullHistory: false,
    markOnlineOnConnect: true
  }

  const sock = makeWASocket(connectionOptions)
  
  // --- LÓGICA DE PAIRING CODE (FIXED) ---
  if (isCode && !sock.authState.creds.registered) {
    let phoneNumber = m.sender.split('@')[0]
    let nombre = await conn.getName(m.sender)
    
    await conn.sendMessage(m.chat, { text: generarMensajeCodigo(nombre) }, { quoted: m })
    
    setTimeout(async () => {
      let code = await sock.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join('-') || code
      await m.reply(`*${code.toUpperCase()}*`)
    }, 3000)
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    const nombre = await conn.getName(m.sender)

    // Si es modo QR
    if (qr && !isCode) {
      let img = await qrcode.toBuffer(qr, { scale: 8 })
      await conn.sendMessage(m.chat, { image: img, caption: generarMensajeQR(nombre) }, { quoted: m })
    }

    if (connection === 'open') {
      sock.isSubBot = true
      global.conns.push(sock)
      await conn.sendMessage(m.chat, { text: generarMensajeExito(nombre, isCode ? 'Código' : 'QR') }, { quoted: m })
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      if (reason !== DisconnectReason.loggedOut) {
        startSubBot({ m, conn, sessionPath, isCode }) // Auto-reconectar
      } else {
        fs.rmSync(sessionPath, { recursive: true, force: true })
      }
    }
  })

  sock.ev.on('creds.update', saveCreds)

  // Manejador de mensajes para el SubBot
  sock.ev.on('messages.upsert', async ({ messages }) => {
    let msg = messages[0]
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return
    msg = smsg(sock, msg)
    if (typeof handler === 'function') await handler(msg, sock, global.plugins)
  })
}
