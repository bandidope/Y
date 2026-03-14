const toxicWords = /\b(puta|puto|mierda|joder|pendejo|gilipollas|cabron|zorra|verga|coño|culo|maricon|hdp|hijo de puta|negra|negro)\b/i

let handler = m => m

handler.before = async function (m, { conn, isAdmin, isOwner }) {
    if (!m.isGroup) return true
    if (!m.text) return true
    
    // ⚠️ QUITÉ la protección de Owner/Admin para que puedas probar que SÍ funciona.
    // Una vez que veas que sirve, vuelve a poner la línea de abajo:
    // if (isAdmin || isOwner) return true 

    let user = global.db.data.users[m.sender]
    if (!user) return true

    const texto = m.text.toLowerCase()

    if (toxicWords.test(texto)) {
        // 1. Intentar borrar el mensaje (El bot DEBE ser admin del grupo)
        try {
            await conn.sendMessage(m.chat, { delete: m.key })
        } catch (e) {
            console.log("No soy admin, no puedo borrar mensajes.")
        }

        // 2. Aumentar advertencia
        user.toxicWarn = (user.toxicWarn || 0) + 1

        // 3. Respuestas con mención
        const name = `@${m.sender.split('@')[0]}`
        
        if (user.toxicWarn === 1) {
            await conn.reply(m.chat, `⚠️ *¡Advertencia 1!* ${name} no seas tóxico darling. 🌸`, m, { mentions: [m.sender] })
            await m.react('⚠️')
        } 
        else if (user.toxicWarn === 2) {
            await conn.reply(m.chat, `⚠️ *¡Advertencia 2!* ${name}, compórtate o te saco. 😡`, m, { mentions: [m.sender] })
            await m.react('😡')
        } 
        else if (user.toxicWarn >= 3) {
            await conn.reply(m.chat, `💥 *¡ADIÓS!* ${name} no escuchaste... 💔`, m, { mentions: [m.sender] })
            await m.react('💀')
            user.toxicWarn = 0
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        return false // Detiene la ejecución de otros comandos si es tóxico
    }
    return true
}

export default handler
