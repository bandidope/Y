import fs from 'fs'
import path from 'path'

const dataDir = './database'
const dataFile = path.join(dataDir, 'coins.json')

let coins = {}
try {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf8').trim()
        if (data) coins = JSON.parse(data)
    }
} catch (e) {}

const saveCoins = () => fs.writeFileSync(dataFile, JSON.stringify(coins, null, 2))

let handler = async (m, { conn, args, command }) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100, lastDaily: 0, lastCofre: 0, lastMinar: 0, lastRob: 0 }
        saveCoins()
    }

    const moneda = global.moneda || 'monedas'

    await m.react('🍬')

    // daily / cofre (24h)
    if (command === 'daily' || command === 'cofre') {
        const cd = 24 * 60 * 60 * 1000
        const key = command === 'daily' ? 'lastDaily' : 'lastCofre'
        if (Date.now() - (coins[userId][key] || 0) < cd) {
            const rem = Math.ceil((coins[userId][key] + cd - Date.now()) / 60000)
            return m.reply(`💔 Vuelve en *${rem} minutos* darling\~`)
        }

        const amount = Math.floor(Math.random() * 999) + 1
        coins[userId].balance += amount
        coins[userId][key] = Date.now()
        saveCoins()

        return m.reply(`💗 Reclamaste tu \( {command === 'daily' ? 'recompensa diaria' : 'cofre'}! Ganaste * \){amount} ${moneda}* 🌸`)
    }

    // minar (24 min)
    if (command === 'minar') {
        const cd = 24 * 60 * 1000
        if (Date.now() - (coins[userId].lastMinar || 0) < cd) {
            const rem = Math.ceil((coins[userId].lastMinar + cd - Date.now()) / 60000)
            return m.reply(`💔 Debes esperar *${rem} minutos* para minar de nuevo darling\~`)
        }

        const exp = Math.floor(Math.random() * 49) + 1
        const money = Math.floor(Math.random() * 99) + 1
        coins[userId].balance += money
        coins[userId].lastMinar = Date.now()
        saveCoins()

        return m.reply(`💗 Minaste con éxito! Obtuviste *\( {exp} exp* y * \){money} ${moneda}* 🌸`)
    }

    // crime
    if (command === 'crime' || command === 'crimen') {
        const amount = Math.floor(Math.random() * 99) + 1
        coins[userId].balance += amount
        saveCoins()

        return m.reply(`💗 Cometiste un crimen y ganaste *${amount} ${moneda}* 😈`)
    }

    // rob (1h)
    if (command === 'rob') {
        const cd = 60 * 60 * 1000
        if (Date.now() - (coins[userId].lastRob || 0) < cd) {
            const rem = Math.ceil((coins[userId].lastRob + cd - Date.now()) / 60000)
            return m.reply(`💔 Debes esperar *${rem} minutos* para robar de nuevo darling\~`)
        }

        const target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('💔 Menciona o responde a alguien para robarle darling\~')

        if (!coins[target]) coins[target] = { balance: 100 }
        const stolen = Math.floor(coins[target].balance * 0.3) + 10
        if (stolen < 10) return m.reply('💔 No tiene casi nada que robar\~')

        coins[target].balance -= stolen
        coins[userId].balance += stolen
        coins[userId].lastRob = Date.now()
        saveCoins()

        return m.reply(`💗 Le robaste *${stolen} \( {moneda}* a @ \){target.split('@')[0]} 😈`, null, { mentions: [target] })
    }

    // saldo / bal
    if (command === 'saldo' || command === 'bal') {
        return m.reply(`💗 *Tu saldo darling!* 🌸\n\n💰 ${moneda}: ${coins[userId].balance}`)
    }

    // baltop (top 10)
    if (command === 'baltop') {
        const top = Object.entries(coins)
            .sort(([,a], [,b]) => b.balance - a.balance)
            .slice(0, 10)

        let txt = '✨ *TOP 10 MÁS RICOS* ✨\n\n'
        top.forEach(([id, data], i) => txt += `\( {i+1}° @ \){id.split('@')[0]} → *${data.balance} ${moneda}*\n`)
        return m.reply(txt, null, { mentions: top.map(t => t[0]) })
    }
}

handler.help = ['daily', 'cofre', 'minar', 'crime', 'rob', 'saldo', 'baltop']
handler.tags = ['economy']
handler.command = ['daily', 'cofre', 'minar', 'crime', 'crimen', 'rob', 'saldo', 'bal', 'baltop']

export default handler