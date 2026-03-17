let handler = async (m, { conn, prefix, who, db }) => {
    conn.pvp = conn.pvp ? conn.pvp : {}
    
    let opponent = who
    
    if (!opponent || opponent === m.sender) {
        return m.reply(`*⚔️ ¡DESAFÍO PVP! ⚔️*\n\nDebes etiquetar a alguien para pelear por monedas.\nEjemplo: *${prefix}pvp @user*`)
    }

    // Verificamos y aseguramos que existan las monedas en la base de datos
    if (typeof db.users[m.sender].coin === 'undefined') db.users[m.sender].coin = 0
    if (typeof db.users[opponent].coin === 'undefined') db.users[opponent].coin = 0

    let apuesta = 200 // Cantidad de monedas a apostar

    if (db.users[m.sender].coin < apuesta) {
        return m.reply(`❌ No tienes suficientes *Coins* para este combate. Necesitas al menos ${apuesta} monedas.`)
    }
    if (db.users[opponent].coin < apuesta) {
        return m.reply(`❌ El oponente no tiene suficientes *Coins* (${apuesta}) para aceptar el reto.`)
    }

    // Evitar que un usuario entre en dos partidas a la vez
    if (conn.pvp[m.chat] && Object.values(conn.pvp[m.chat]).some(g => g.p1 === m.sender || g.p2 === m.sender)) {
        return m.reply('⚠️ Ya estás en medio de un desafío o esperando una respuesta.')
    }

    let gameId = m.sender + '-' + opponent
    conn.pvp[m.chat] = conn.pvp[m.chat] || {}

    conn.pvp[m.chat][gameId] = {
        p1: m.sender,
        p2: opponent,
        state: 'ESPERANDO_ACEPTACION',
        p1Choice: null,
        p2Choice: null,
        bet: apuesta,
        timeout: setTimeout(() => {
            if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                delete conn.pvp[m.chat][gameId]
                conn.sendMessage(m.chat, { text: '⏳ *PVP CANCELADO:* El oponente tardó demasiado en aceptar el duelo.' })
            }
        }, 30000)
    }

    await conn.sendMessage(m.chat, { 
        text: `⚔️ *DUELO POR MONEDAS* ⚔️\n\n@${m.sender.split('@')[0]} ha desafiado a @${opponent.split('@')[0]}\n💰 *Apuesta:* ${apuesta} Coins\n\n@${opponent.split('@')[0]}, escribe *Aceptar* para iniciar la batalla o *Rechazar*.`,
        mentions: [m.sender, opponent]
    }, { quoted: m })
}

handler.before = async function (m, { conn }) {
    conn.pvp = conn.pvp ? conn.pvp : {}
    if (!conn.pvp[m.chat]) return

    let gameId = Object.keys(conn.pvp[m.chat]).find(id => id.includes(m.sender))
    if (!gameId) return
    
    let game = conn.pvp[m.chat][gameId]
    let input = m.text.toLowerCase().trim()
    let database = global.database // Usamos la instancia global para guardar

    // --- FASE 1: ACEPTACIÓN ---
    if (game.state === 'ESPERANDO_ACEPTACION' && m.sender === game.p2) {
        if (input === 'aceptar') {
            clearTimeout(game.timeout)
            game.state = 'ESPERANDO_ELECCION'
            game.timeout = setTimeout(() => {
                if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                    delete conn.pvp[m.chat][gameId]
                    conn.sendMessage(m.chat, { text: '⏳ *PVP TERMINADO:* Alguien se acobardó y no eligió su jugada.' })
                }
            }, 30000)
            return m.reply('✅ *Duelo aceptado.* ¡Prepárense!\n\nEscriban: *Piedra*, *Papel* o *Tijera*.\n(Sus mensajes serán borrados para mantener el secreto)')
        } else if (input === 'rechazar') {
            clearTimeout(game.timeout)
            delete conn.pvp[m.chat][gameId]
            return m.reply('❌ El duelo ha sido rechazado.')
        }
    }

    // --- FASE 2: JUEGO ---
    if (game.state === 'ESPERANDO_ELECCION' && (m.sender === game.p1 || m.sender === game.p2)) {
        let opciones = ['piedra', 'papel', 'tijera']
        if (opciones.includes(input)) {
            if (m.sender === game.p1 && !game.p1Choice) game.p1Choice = input
            if (m.sender === game.p2 && !game.p2Choice) game.p2Choice = input
            
            // Borrar mensaje para evitar que el otro vea la jugada
            try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

            if (game.p1Choice && game.p2Choice) {
                clearTimeout(game.timeout)
                let win = ''
                let { p1, p2, p1Choice: c1, p2Choice: c2 } = game
                let userDb = global.database.data.users

                if (c1 === c2) win = 'empate'
                else if ((c1 === 'piedra' && c2 === 'tijera') || (c1 === 'papel' && c2 === 'piedra') || (c1 === 'tijera' && c2 === 'papel')) win = p1
                else win = p2

                let res = `⚔️ *RESULTADOS DEL DUELO* ⚔️\n\n` +
                          `@${p1.split('@')[0]} eligió: ${c1}\n` +
                          `@${p2.split('@')[0]} eligió: ${c2}\n\n`

                if (win === 'empate') {
                    res += '🤝 *¡Es un empate!* Nadie pierde sus monedas.'
                } else {
                    let loser = (win === p1) ? p2 : p1
                    
                    // Transacción de monedas
                    userDb[win].coin += game.bet
                    userDb[loser].coin -= game.bet
                    
                    // Guardar cambios en el JSON
                    await database.save()

                    res += `🎉 *¡GANADOR:* @${win.split('@')[0]} *!*\n💰 Se lleva: *${game.bet} Coins* de su oponente.`
                }

                await conn.sendMessage(m.chat, { text: res, mentions: [p1, p2] })
                delete conn.pvp[m.chat][gameId]
            }
        }
    }
}

handler.command = ['pvp', 'duelo'] // Ahora el handler lo detectará sin problemas
handler.group = true

export default handler
