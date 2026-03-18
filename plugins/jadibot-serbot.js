async function startSubBot({ m, conn, sessionPath, isCode }) {
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()
  const ownerJid = m.sender // Guardamos quién es el dueño de este SubBot
  
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
  
  // --- LÓGICA DE PAIRING CODE ---
  if (isCode && !sock.authState.creds.registered) {
    let phoneNumber = ownerJid.split('@')[0]
    let nombre = await conn.getName(ownerJid)
    
    await conn.sendMessage(m.chat, { text: generarMensajeCodigo(nombre) }, { quoted: m })
    
    setTimeout(async () => {
      let code = await sock.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join('-') || code
      await m.reply(`*${code.toUpperCase()}*`)
    }, 3000)
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    const nombre = await conn.getName(ownerJid)

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
      const sessionName = path.basename(sessionPath)

      // --- SISTEMA DE NOTIFICACIONES POR PRIVADO ---
      if (reason === DisconnectReason.loggedOut) {
        await conn.sendMessage(ownerJid, { 
          text: `✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸 · 𝓐𝓵𝓮𝓻𝓽𝓪\n\n❌ **Sesión cerrada.** Has cerrado la sesión desde tu WhatsApp o el dispositivo fue desvinculado.\n\n> Tus archivos de sesión han sido eliminados por seguridad.` 
        })
        fs.rmSync(sessionPath, { recursive: true, force: true })
      } 
      else if (reason === DisconnectReason.restartRequired || reason === DisconnectReason.connectionLost) {
        await conn.sendMessage(ownerJid, { 
          text: `✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸 · 𝓐𝓵𝓮𝓻𝓽𝓪\n\n🔄 **Reconectando...** Se perdió la conexión temporalmente. Intentaré volver a conectar tu SubBot ahora mismo.` 
        })
        startSubBot({ m, conn, sessionPath, isCode }) 
      }
      else {
        await conn.sendMessage(ownerJid, { 
          text: `✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸 · 𝓐𝓵𝓮𝓻𝓽𝓪\n\n⚠️ **Desconexión inesperada.**\nCódigo: ${reason}\n\n> Intentando reanudar la sesión...` 
        })
        startSubBot({ m, conn, sessionPath, isCode })
      }
      
      // Limpiar de la lista global
      global.conns = global.conns.filter(c => c.user?.jid !== sock.user?.jid)
    }
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    let msg = messages[0]
    if (!msg.message || msg.key.remoteJid === 'status@broadcast') return
    msg = smsg(sock, msg)
    if (typeof handler === 'function') await handler(msg, sock, global.plugins)
  })
}
