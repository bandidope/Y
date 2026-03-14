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

let handler = async (m) => {
    const userId = m.sender
    if (!coins[userId]) {
        coins[userId] = { balance: 100 }
    }

    const moneda = global.moneda || 'monedas'
    const balance = coins[userId].balance || 0

    await m.react('🍬')

    const invText = `💗 *¡INVENTARIO DE ${m.pushName || 'darling'}!* 🌸\n\n` +
                    `💰 ${moneda}: ${balance}\n` +
                    `🔹 Otros items: (próximamente)\n` +
                    `   - Pociones de amor: 0\n` +
                    `   - Caramelos de Zero Two: 0\n` +
                    `   - Alas de vuelo: 0\n\n` +
                    `¡Sigue usando los comandos para llenar tu inventario darling\~! 💕`

    return m.reply(invText)
}

handler.help = ['inventario', 'inv', 'myinv']
handler.tags = ['economy', 'rpg']
handler.command = ['inventario', 'inv', 'myinv']
handler.group = true

export default handler