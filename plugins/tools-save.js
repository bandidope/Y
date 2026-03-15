let handler = async (m, { conn }) => {
    // 1. Verificamos que esté respondiendo a algo
    if (!m.quoted) {
        await m.react('⚠️')
        return m.reply('💗 Darling~ responde al mensaje que quieres guardar para que te lo mande al privado.')
    }

    await m.react('📦')

    try {
        // Usamos el método copyNForward directamente desde el mensaje citado
        // Esto es mucho más efectivo que llamarlo desde conn
        await m.quoted.copyNForward(m.sender, true)
        
        // Si llega aquí, es que sí se envió
        await m.react('🍬')
        // Opcional: Confirmación en el grupo
        // await m.reply('✅ ¡Guardado en tu privado, darling! 🌸')

    } catch (e) {
        console.error("Error en save:", e)
        
        // Si el método directo falla, intentamos el método manual de respaldo
        try {
            let jid = m.sender
            let msg = m.quoted.fakeObj
            await conn.copyNForward(jid, msg, true)
            await m.react('🍬')
        } catch (err2) {
            await m.react('💔')
            m.reply('💔 Darling, no pude reenviar el contenido. Asegúrate de que no sea un mensaje efímero o que el chat privado no esté bloqueado.')
        }
    }
}

handler.help = ['save']
handler.tags = ['utilidad']
handler.command = ['save', 'guardar', 'priv']
handler.group = true 

export default handler
