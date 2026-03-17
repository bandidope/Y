let handler = async (m, { conn, prefix, who, db }) => {
    // Inicializamos el objeto de partidas si no existe
    conn.pvp = conn.pvp ? conn.pvp : {}
    
    // El 'who' ya viene filtrado por tu handler.js (menciones o respuesta)
    let opponent = who
    
    if (!opponent || opponent === m.sender) {
        return m.reply(`*⚔️ ¡DESAFÍO PVP! ⚔️*\n\nDebes etiquetar a alguien o responder a su mensaje.\nEjemplo: *${prefix}pvp @user*`)
    }

    // Verificar si el usuario tiene suficiente experiencia para apostar (200 exp)
    if (db.users[m.sender].exp < 200) return m.reply('❌ No tienes suficiente *EXP* (necesitas 200) para iniciar una batalla.')
    if (db.users[opponent].exp < 200) return m.reply('❌ El oponente es muy pobre, no tiene suficiente *EXP* para pelear.')

    // Evitar múltiples partidas en el mismo grupo
    if (conn.pvp[m.chat] && Object.values(conn.pvp[m.chat]).some(g => g.p1 === m.sender || g.p2 === m.sender)) {
        return m.reply('⚠️ Ya tienes un combate pendiente o en curso.')
    }

    let gameId = m.sender + '-' + opponent
    conn.pvp[m.chat] = conn.pvp[m.chat] || {}

    conn.pvp[m.chat][gameId] = {
        p1: m.sender,
        p2: opponent,
        state: 'ESPERANDO_ACEPTACION',
        p1Choice: null,
        p2Choice: null,
        bet: 200, // Cantidad de apuesta
        timeout: setTimeout(() => {
            if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                delete conn.pvp[m.chat][gameId]
                conn.sendMessage(m.chat, { text: '⏳ *Batalla terminada:* Tardaron demasiado en aceptar.' })
            }
        }, 30000)
    }

    let text = `⚔️ *DESAFÍO DE PODER* ⚔️\n\n` +
               `@${m.sender.split('@')[0]} reta a @${opponent.split('@')[0]}\n` +
               `💰 *Apuesta:* 200 EXP\n\n` +
               `*El oponente debe escribir "Aceptar" para empezar.*\n` +
               `⏳ Tienen 30 segundos.`

    await conn.sendMessage(m.chat, { text, mentions: [m.sender, opponent] }, { quoted: m })
}

// Lógica de escucha (Before)
handler.before = async function (m, { conn }) {
    conn.pvp = conn.pvp ? conn.pvp : {}
    if (!conn.pvp[m.chat]) return

    let gameId = Object.keys(conn.pvp[m.chat]).find(id => id.includes(m.sender))
    if (!gameId) return
    
    let game = conn.pvp[m.chat][gameId]
    let input = m.text.toLowerCase().trim()
    let db = global.database.data // Acceso a la db global

    // 1. ACEPTAR EL RETO
    if (game.state === 'ESPERANDO_ACEPTACION' && m.sender === game.p2) {
        if (input === 'aceptar') {
            clearTimeout(game.timeout)
            game.state = 'ESPERANDO_ELECCION'
            
            game.timeout = setTimeout(() => {
                if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                    delete conn.pvp[m.chat][gameId]
                    conn.sendMessage(m.chat, { text: '⏳ Se acabó el tiempo para elegir. Combate cancelado.' })
                }
            }, 30000)

            return m.reply('✅ *Reto aceptado.*\n\nAmbos escriban: *Piedra*, *Papel* o *Tijera*.\n(El bot borrará sus mensajes para que no hagan trampa)')
        }
    }

    // 2. ELEGIR JUGADA
    if (game.state === 'ESPERANDO_ELECCION' && (m.sender === game.p1 || m.sender === game.p2)) {
        let choices = ['piedra', 'papel', 'tijera']
        if (choices.includes(input)) {
            if (m.sender === game.p1 && !game.p1Choice) game.p1Choice = input
            if (m.sender === game.p2 && !game.p2Choice) game.p2Choice = input

            // Intentar borrar la elección para privacidad
            try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

            // Cuando ambos eligen
            if (game.p1Choice && game.p2Choice) {
                clearTimeout(game.timeout)
                let win = ''
                let p1 = game.p1, p2 = game.p2
                let c1 = game.p1Choice, c2 = game.p2Choice

                if (c1 === c2) {
                    win = 'empate'
                } else if ((c1 === 'piedra' && c2 === 'tijera') || (c1 === 'papel' && c2 === 'piedra') || (c1 === 'tijera' && c2 === 'papel')) {
                    win = p1
                } else {
                    win = p2
                }

                let finalMsg = `⚔️ *RESULTADOS DEL PVP* ⚔️\n\n` +
                               `@${p1.split('@')[0]}: ${c1}\n` +
                               `@${p2.split('@')[0]}: ${c2}\n\n`

                if (win === 'empate') {
                    finalMsg += `🤝 *¡Es un empate! No se pierden monedas.*`
                } else {
                    let loser = (win === p1) ? p2 : p1
                    db.users[win].exp += game.bet
                    db.users[loser].exp -= game.bet
                    finalMsg += `🎉 ¡@${win.split('@')[0]} aplastó a @${loser.split('@')[0]}!\n💰 Gana: *${game.bet} EXP*`
                }

                await conn.sendMessage(m.chat, { text: finalMsg, mentions: [p1, p2] })
                delete conn.pvp[m.chat][gameId]
            }
        }
    }
}

handler.command = /^(pvp)$/i
handler.group = true // Solo en grupos según tu lógica de handler

export default handler
