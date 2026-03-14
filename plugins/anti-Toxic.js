let handler = m => {
    if (!m.isGroup) return true
    if (!m.text) return true
    if (m.isAdmin || m.isOwner) return true  // Staff protegido

    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = { toxicWarn: 0 }
        user = global.db.data.users[m.sender]
    }

    // Lista de palabras tóxicas (mejorada y más completa)
    const toxicRegex = /\b(puta|puto|mierda|joder|pendejo|gilipollas|cabrón|zorra|verga|coño|culo|maricón|hdp|hijo de puta|negro|negra|estúpido|idiota|imbécil)\b/i

    if (toxicRegex.test(m.text.toLowerCase())) {
        // Borrar mensaje tóxico
        try {
            await conn.sendMessage(m.chat, { delete: m.key })
        } catch {}

        user.toxicWarn = (user.toxicWarn || 0) + 1

        const name = `@${m.sender.split('@')[0]}`

        if (user.toxicWarn === 1) {
            await m.reply(`⚠️ *¡Primera advertencia darling!* 🌸\nNo uses palabras tóxicas o te voy a sacar del grupo.`, null, { mentions: [m.sender] })
            await m.react('⚠️')
        } 
        else if (user.toxicWarn === 2) {
            await m.reply(`⚠️ *¡Segunda advertencia!* ${name}\nYa van dos... la próxima te echo sin piedad 😡`, null, { mentions: [m.sender] })
            await m.react('😡')
        } 
        else if (user.toxicWarn >= 3) {
            await m.reply(`💥 *¡TERCERA Y ÚLTIMA!* ${name}\nLo siento darling, pero llegaste al límite... 💔`, null, { mentions: [m.sender] })
            await m.react('💀')

            // Kick
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            user.toxicWarn = 0
        }

        return false // Bloquea el mensaje
    }
    return true
}

handler.before = true
handler.group = true

export default handler