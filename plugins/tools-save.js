let handler = async (m, { conn }) => {
    // 1. Verificación básica
    if (!m.quoted) {
        await m.react('⚠️')
        return m.reply('💗 Darling~ responde al mensaje que quieres guardar.')
    }

    await m.react('📦')

    try {
        // 2. Obtenemos el mensaje citado de forma completa
        let q = await m.getQuotedObj()
        if (!q.message) throw 'Mensaje vacío'

        // 3. Usamos copyNForward pero con el objeto REAL (q)
        // Esto soluciona que te llegue el mensaje vacío al privado
        await conn.copyNForward(m.sender, q, true)
        
        await m.react('🍬')
        await m.reply('✅ ¡Listo mi amor! Revisa tu chat privado, ya te lo guardé~ 🌸')

    } catch (e) {
        console.error("Error crítico en save:", e)
        
        // 4. ÚLTIMO RECURSO: Reenvío manual si copyNForward falla
        try {
            await conn.sendMessage(m.sender, { forward: m.quoted.fakeObj }, { quoted: m.quoted.fakeObj })
            await m.react('🍬')
        } catch (err2) {
            await m.react('💔')
            m.reply('💔 Darling, parece que WhatsApp no me deja enviarte este mensaje específico al privado. ¡Intenta con otro!')
        }
    }
}

handler.help = ['save']
handler.tags = ['utilidad']
handler.command = ['save', 'guardar', 'priv']
handler.group = true 

export default handler
