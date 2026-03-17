let handler = async (m, { conn, args, text, usedPrefix, command, db }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat
    
    if (!who) return m.reply(`*⚠️ ¿A quién quieres darle monedas?*\n\nEjemplo:\n*${usedPrefix + command} @user 500*`)
    
    // Extraer la cantidad del texto
    let txt = text.replace('@' + who.split`@` [0], '').trim()
    let count = parseInt(txt)
    if (isNaN(count)) return m.reply('*🔢 Por favor, ingresa una cantidad válida de monedas.*')

    // Asegurar que el usuario existe en la DB
    if (!db.users[who]) db.users[who] = { coin: 0, exp: 0, limit: 20 }
    if (db.users[who].coin === undefined) db.users[who].coin = 0

    // Sumar las monedas
    db.users[who].coin += count
    await global.database.save() // Guardar cambios en el JSON

    let name = conn.getName(who)
    m.reply(`*✅ MONEDAS AÑADIDAS*\n\n*👤 Usuario:* ${name}\n*💰 Cantidad:* ${count} Coins\n*👛 Total ahora:* ${db.users[who].coin}`)
}

handler.help = ['addcoins @user <cantidad>']
handler.tags = ['owner']
handler.command = ['addcoins', 'añadircoins', 'darcoins']

// REGLA DE SEGURIDAD: Solo el dueño puede usarlo
handler.owner = true 

export default handler
