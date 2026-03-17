let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i

const isNumber = (x) => !isNaN(parseInt(x))

let handler = async (m, { conn, text, isOwner }) => {
  try {
    if (!text) return m.reply('♡ Darling... envíame un enlace válido 💗')

    // 💗 Limpiar texto (por si viene con ?mode= o extras)
    let cleanText = text.trim().split(' ')[0]

    let match = cleanText.match(linkRegex)
    if (!match) return m.reply('♡ Ese enlace no es válido... intenta otra vez')

    let code = match[1]

    // 💗 Días
    let daysStr = text.split(' ')[1]
    let days = 0

    if (isOwner) {
      days = daysStr && isNumber(daysStr)
        ? Math.min(999, Math.max(1, parseInt(daysStr)))
        : 0
    } else {
      days = 3
    }

    // 💌 Unirse
    let groupId = await conn.groupAcceptInvite(code)

    // 💗 Nombre del grupo
    let groupName = groupId
    try {
      let meta = await conn.groupMetadata(groupId)
      if (meta?.subject) groupName = meta.subject
    } catch {}

    // 💾 DB segura
    global.db = global.db || {}
    global.db.data = global.db.data || {}
    global.db.data.chats = global.db.data.chats || {}

    let chats = global.db.data.chats
    chats[groupId] = chats[groupId] || {}

    if (days > 0) {
      chats[groupId].expired = Date.now() + days * 86400000
    } else {
      delete chats[groupId].expired
    }

    // 💬 Confirmación
    await m.reply(`♡ Me uní a *${groupName}*...\n♡ ${days ? `Estaré ${days} día(s) contigo 💗` : 'Me quedaré contigo, Darling... 💗'}`)

    // 🎥 Mensaje Zero Two
    let media = 'https://files.catbox.moe/sjak3i.jpg'
    let texto = `╭━━━〔 ♡ 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 ♡ 〕━━━⬣
┃ ❥ Ya llegué, Darling... 💗
┃ ❥ ¿Me extrañabas?~
┃ ❥ Usa mis comandos si me necesitas
╰━━━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(groupId, {
      video: { url: media },
      gifPlayback: true,
      caption: texto,
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('♡ No pude unirme... tal vez el enlace expiró 💔')
  }
}

handler.help = ['join <link> [días]']
handler.tags = ['owner']
handler.command = ['join', 'entrar']
handler.owner = true

export default handler