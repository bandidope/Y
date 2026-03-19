import { database } from '../lib/database.js'

let handler = async (m, { args, prefix, command }) => {
    // 1. Extraemos el primer argumento (on u off)
    let action = args[0]?.toLowerCase()

    if (action !== 'on' && action !== 'off') {
        return m.reply(`✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n⚠️ Uso incorrecto, darling.\nEjemplo: *${prefix + command} on* o *${prefix + command} off*`)
    }

    // 2. Iniciación Forzada (Blindaje de Base de Datos)
    if (!database.data.groups) database.data.groups = {}
    if (!database.data.groups[m.chat]) database.data.groups[m.chat] = {}

    // 3. Aplicamos el estado boolean
    const estado = action === 'on'
    database.data.groups[m.chat].bot = estado

    // 4. Mensaje estético
    const mensaje = estado 
        ? '✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n✅ *Bot activado*\nAhora responderé a todos en este grupo, darling~' 
        : '✦ 𝓩𝓮𝓻𝓸 𝓣𝔀𝓸\n\n❌ *Bot desactivado*\nAhora estaré en silencio. Solo escucharé a mis creadores.'

    await m.reply(mensaje)
    await m.react(estado ? '✅' : '❌')
}

handler.help = ['bot on', 'bot off']
handler.tags = ['group']
handler.command = ['bot']

// Estas propiedades ya hacen el trabajo de bloquear si no es grupo o si no es admin
handler.group = true 
handler.admin = true

export default handler
