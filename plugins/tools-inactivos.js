let handler = async (m, { conn, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('💔 Solo funciona en grupos darling\~')
    if (!isAdmin && !isOwner) return m.reply('💔 Solo admins y owner pueden usar este comando')

    await m.react('🍬')

    const group = await conn.groupMetadata(m.chat)
    const inactivos = group.participants.filter(p => !p.admin).map(p => p.id)

    if (inactivos.length === 0) {
        return m.reply('✅ No hay usuarios inactivos en este grupo.')
    }

    const buttonMessage = {
        text: `⚠️ *${inactivos.length} usuarios inactivos detectados*\n\n¿Quieres eliminarlos ahora?`,
        footer: 'Zero Two Bot',
        buttons: [
            {
                buttonId: 'eliminar_inactivos_confirm',
                buttonText: { displayText: 'Eliminar Inactivos' },
                type: 1
            }
        ],
        headerType: 1
    }

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m })

    // Enviar al canal oficial (rcanal)
    const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'
    await conn.sendMessage(CANAL, {
        text: `⚠️ *Inactivos detectados*\nGrupo: ${group.subject}\nCantidad: ${inactivos.length}`
    })
}

handler.help = ['inactivos']
handler.tags = ['group']
handler.command = ['inactivos']
handler.group = true
handler.admin = true

export default handler