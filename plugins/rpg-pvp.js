// plugins/rpg-pvp.js
let handler = async (m, { conn, prefix, who }) => {
    conn.pvp = conn.pvp ? conn.pvp : {}
    
    // Usamos 'who' que ya viene procesado por tu handler.js
    let opponent = who
    
    if (!opponent || opponent === m.sender) {
        return m.reply(`⚠️ Etiqueta a alguien para pelear.\nEjemplo: *${prefix}pvp @user*`)
    }

    if (conn.pvp[m.chat] && conn.pvp[m.chat][m.sender]) return m.reply('❌ Ya tienes una partida en curso.')

    let gameId = m.sender + '-' + opponent
    conn.pvp[m.chat] = conn.pvp[m.chat] || {}

    conn.pvp[m.chat][gameId] = {
        p1: m.sender,
        p2: opponent,
        state: 'ESPERANDO_ACEPTACION',
        p1Choice: null,
        p2Choice: null,
        timeout: setTimeout(() => {
            if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                delete conn.pvp[m.chat][gameId]
                conn.sendMessage(m.chat, { text: '⏳ Tardaste mucho, batalla terminada.' })
            }
        }, 30000)
    }

    await conn.sendMessage(m.chat, { 
        text: `⚔️ @${m.sender.split('@')[0]} desafió a @${opponent.split('@')[0]}\n\nEscribe *Aceptar* para iniciar.\n⏳ 30 segundos.`,
        mentions: [m.sender, opponent]
    }, { quoted: m })
}

// El resto del código (handler.before) se mantiene igual que el anterior
// solo asegúrate de que el archivo termine con:
handler.command = /^(pvp)$/i
export default handler
