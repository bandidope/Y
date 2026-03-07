let handler = async (m, { conn, who, prefix, isAdmin, isBotAdmin }) => {
    if (!who) return m.reply(`Menciona o responde a un usuario.\nEjemplo: *${prefix}unmute @usuario*`)
    if (!isAdmin) return m.reply('👮 Solo administradores pueden usar este comando.')
    if (!isBotAdmin) return m.reply('🤖 Necesito ser admin para esto.')

    const muted = global.db.data.groups?.[m.chat]?.muted
    if (!muted || !muted.includes(who)) return m.reply('Este usuario no está muteado.')

    global.db.data.groups[m.chat].muted = muted.filter(j => j !== who)
    await global.db.save()

    await conn.sendMessage(m.chat, {
        text: `🔊 @${who.split('@')[0]} ha sido desmuteado.`,
        mentions: [who]
    })
}

handler.command = ['unmute']
handler.tags = ['grupos']
handler.group = true

export default handler
