let handler = m => {
    if (!m.isGroup) return true
    if (m.isAdmin || m.isOwner) return true  // Admins y owner inmunes

    let user = global.db.data.users[m.sender]
    if (!user) {
        global.db.data.users[m.sender] = { toxicWarn: 0 }
        user = global.db.data.users[m.sender]
    }

    const toxicWords = [
        'puta', 'puto', 'mierda', 'joder', 'carajo', 'pendejo', 'gilipollas',
        'cabron', 'zorra', 'verga', 'coño', 'culo', 'huevos', 'mamahuevo',
        'maricon', 'maricón', 'cabrón', 'hijo de puta', 'hdp', 'pajero',
        'pajera', 'estupido', 'estúpido', 'idiota', 'imbecil', 'imbécil'
    ]

    const texto = m.text.toLowerCase()
    const esToxic = toxicWords.some(palabra => texto.includes(palabra))

    if (esToxic) {
        user.toxicWarn = (user.toxicWarn || 0) + 1

        if (user.toxicWarn === 1) {
            m.reply(`💔 *¡Primera advertencia darling!* 🌸\nNo uses palabras tóxicas o te voy a tener que sacar\~`)
            m.react('⚠️')
        } 
        else if (user.toxicWarn === 2) {
            m.reply(`💔 *¡Segunda advertencia darling!* 🌸\nYa van dos... la próxima te echo del grupo, no me hagas enojar\~`)
            m.react('⚠️')
        } 
        else if (user.toxicWarn >= 3) {
            m.reply(`💔 *¡TERCERA ADVERTENCIA!* 🌸\nLo siento darling, pero llegaste al límite... te tengo que sacar del grupo.`)

            conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            user.toxicWarn = 0  // Reinicia el contador
            m.react('💥')
        }
    }

    return true
}

handler.before = true
handler.group = true

export default handler