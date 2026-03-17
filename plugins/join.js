let linkRegex = /(?:chat\.whatsapp\.com\/|https?:\/\/chat\.whatsapp\.com\/)([0-9A-Za-z]{20,24})/i

const isNumber = (x) => !isNaN(x) && !isNaN(parseInt(x))

let handler = async (m, { conn, text, isOwner, usedPrefix }) => {
  try {
    if (!text) {
      return m.reply(`♡ Darling... pásame un enlace de grupo 💗\n\nEjemplo:\n${usedPrefix}join https://chat.whatsapp.com/ABCDEFGHIJK123456789 7`)
    }

    // Buscar el código del invite en cualquier parte del texto
    let match = text.match(linkRegex)
    if (!match || !match[1]) {
      return m.reply('♡ Mmm... ese enlace no parece válido, Darling 💔\nAsegúrate que sea un enlace de invitación de WhatsApp')
    }

    let code = match[1]

    // ──────────────── Días de permanencia ────────────────
    let days = 0
    // Solo owners pueden elegir días
    if (isOwner) {
      // Buscar número al final o después del link
      let args = text.replace(linkRegex, '').trim().split(/\s+/)
      let possibleDays = args.find(arg => isNumber(arg))
      if (possibleDays) {
        days = Math.max(1, Math.min(999, parseInt(possibleDays)))
      }
    } else {
      days = 3 // valor por defecto para no-owners
    }

    // ──────────────── Intentar unirse ────────────────
    let groupId
    try {
      groupId = await conn.groupAcceptInvite(code)
    } catch (err) {
      if (err.message?.includes('already')) {
        return m.reply('♡ Ya estoy en ese grupo, Darling... 💗')
      }
      if (err.message?.includes('expired') || err.message?.includes('invalid')) {
        return m.reply('♡ El enlace está expirado o es inválido 💔')
      }
      throw err
    }

    if (!groupId?.endsWith('@g.us')) {
      return m.reply('♡ Algo salió mal... no obtuve un ID de grupo válido 💔')
    }

    // ──────────────── Obtener nombre del grupo ────────────────
    let groupName = 'Grupo desconocido'
    try {
      let meta = await conn.groupMetadata(groupId)
      if (meta?.subject) groupName = meta.subject
    } catch (e) {}

    // ──────────────── Guardar en DB ────────────────
    global.db = global.db || { data: {} }
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}

    let chats = global.db.data.chats
    chats[groupId] = chats[groupId] || {}

    if (days > 0) {
      chats[groupId].expired = Date.now() + (days * 86400000)
      chats[groupId].joinDate = Date.now() // opcional: para tracking
    } else {
      delete chats[groupId].expired
    }

    // ──────────────── Mensaje de confirmación al usuario ────────────────
    await m.reply(
      `♡ Ya entré a *${groupName}*... 💗\n` +
      `${days ? `Me quedaré ${days} día(s) contigo\~` : 'Me quedaré contigo para siempre, Darling... ♡'}`
    )

    // ──────────────── Mensaje de bienvenida en el grupo (Zero Two style) ────────────────
    let media = 'https://files.catbox.moe/sjak3i.jpg' // verifica que este link siga funcionando

    let welcomeText = `╭━━━〔 ♡ 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 ♡ 〕━━━⬣
┃ ❥ Ya llegué, Darling... 💗
┃ ❥ Ahora este grupo es más divertido\~
┃ ❥ Llámame si me necesitas\~ ♡
╰━━━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(groupId, {
      video: { url: media },
      gifPlayback: true,
      caption: welcomeText,
      mentions: [m.sender]
    })

  } catch (e) {
    console.error('[join]', e)
    let msg = '♡ No pude entrar... 💔\n'
    if (e.message?.includes('already')) msg += 'Ya estoy en ese grupo\~'
    else if (e.message?.includes('expired')) msg += 'El enlace expiró...'
    else if (e.message?.includes('limit')) msg += 'Límite de uniones alcanzado...'
    else msg += 'Ocurrió un error inesperado'
    
    await m.reply(msg)
  }
}

handler.help = ['join <link> [días]']
handler.tags = ['owner']
handler.command = /^(join|entrar)$/i
handler.owner = false          // ← puedes dejarlo false si quieres que todos lo usen
handler.group = false
handler.private = true         // recomendable

export default handler