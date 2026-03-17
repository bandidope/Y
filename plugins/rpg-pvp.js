let handler = async (m, { conn, prefix, who, db }) => {
    conn.pvp = conn.pvp ? conn.pvp : {}
    let opponent = who
    
    if (!opponent || opponent === m.sender) {
        return m.reply(`*⚔️ ¡DESAFÍO PVP! ⚔️*\n\nDebes etiquetar a alguien.\nEjemplo: *${prefix}pvp @user*`)
    }

    // --- SOLUCIÓN AL ERROR: Inicialización forzada ---
    if (!db.users[m.sender]) db.users[m.sender] = { coin: 0, exp: 0, limit: 20 }
    if (!db.users[opponent]) db.users[opponent] = { coin: 0, exp: 0, limit: 20 }

    // Aseguramos que la propiedad 'coin' exista en ambos
    if (db.users[m.sender].coin === undefined) db.users[m.sender].coin = 0
    if (db.users[opponent].coin === undefined) db.users[opponent].coin = 0

    let apuesta = 200

    if (db.users[m.sender].coin < apuesta) {
        return m.reply(`❌ No tienes suficientes monedas. Necesitas ${apuesta} y tienes ${db.users[m.sender].coin}.`)
    }
    if (db.users[opponent].coin < apuesta) {
        return m.reply(`❌ El oponente solo tiene ${db.users[opponent].coin} monedas. No puede apostar ${apuesta}.`)
    }

    if (conn.pvp[m.chat] && Object.values(conn.pvp[m.chat]).some(g => g.p1 === m.sender || g.p2 === m.sender)) {
        return m.reply('⚠️ Ya tienes un duelo pendiente.')
    }

    let gameId = m.sender + '-' + opponent
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
                conn.sendMessage(m.chat, { text: '⏳ PVP cancelado por falta de respuesta.' })
            }
        }, 30000)
    }

    await conn.sendMessage(m.chat, { 
        text: `⚔️ *RETARON A @${opponent.split('@')[0]}*\n💰 Apuesta: ${apuesta} Coins\n\nEscribe *Aceptar* para pelear.`,
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
    let database = global.database

    if (game.state === 'ESPERANDO_ACEPTACION' && m.sender === game.p2) {
        if (input === 'aceptar') {
            clearTimeout(game.timeout)
            game.state = 'ESPERANDO_ELECCION'
            game.timeout = setTimeout(() => {
                if (conn.pvp[m.chat] && conn.pvp[m.chat][gameId]) {
                    delete conn.pvp[m.chat][gameId]
                    conn.sendMessage(m.chat, { text: '⏳ Tiempo agotado para elegir.' })
                }
            }, 30000)
            return m.reply('✅ Duelo aceptado. ¡Escriban: *Piedra*, *Papel* o *Tijera*!')
        }
    }

    if (game.state === 'ESPERANDO_ELECCION' && (m.sender === game.p1 || m.sender === game.p2)) {
        let choices = ['piedra', 'papel', 'tijera']
        if (choices.includes(input)) {
            if (m.sender === game.p1 && !game.p1Choice) game.p1Choice = input
            if (m.sender === game.p2 && !game.p2Choice) game.p2Choice = input
            
            try { await conn.sendMessage(m.chat, { delete: m.key }) } catch {}

            if (game.p1Choice && game.p2Choice) {
                clearTimeout(game.timeout)
                let win = ''
                let { p1, p2, p1Choice: c1, p2Choice: c2 } = game
                let userDb = global.database.data.users

                if (c1 === c2) win = 'empate'
                else if ((c1 === 'piedra' && c2 === 'tijera') || (c1 === 'papel' && c2 === 'piedra') || (c1 === 'tijera' && c2 === 'papel')) win = p1
                else win = p2

                let res = `⚔️ *RESULTADOS* ⚔️\n\n@${p1.split('@')[0]}: ${c1}\n@${p2.split('@')[0]}: ${c2}\n\n`

                if (win === 'empate') {
                    res += '🤝 ¡Empate!'
                } else {
                    let loser = (win === p1) ? p2 : p1
                    userDb[win].coin += game.bet
                    userDb[loser].coin -= game.bet
                    await database.save()
                    res += `🎉 Ganador: @${win.split('@')[0]}\n💰 Ganancia: ${game.bet} Coins`
                }
                await conn.sendMessage(m.chat, { text: res, mentions: [p1, p2] })
                delete conn.pvp[m.chat][gameId]
            }
        }
    }
}

handler.command = ['pvp']
handler.group = true
export default handler
