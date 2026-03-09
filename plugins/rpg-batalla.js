import { database } from '../lib/database.js'

const enemigos = [
    "Slime Rey pervertido", "Goblin caliente", "Dragón waifu celosa",
    "Esqueleto con fetiche", "Demonio incubo", "Clon malvado de Zero Two"
]

let handler = async (m, { command }) => {
    const userId = m.sender

    if (!database.data.users) database.data.users = {}
    if (!database.data.users[userId]) database.data.users[userId] = {}

    const user = database.data.users[userId]
    if (!user.coins) user.coins = 100
    if (!user.lastBatalla) user.lastBatalla = 0

    const moneda = global.moneda || 'monedas'

    await m.react('🍬')

    // Cooldown 15 minutos
    if (Date.now() - user.lastBatalla < 900000) {
        const tiempo = Math.ceil((900000 - (Date.now() - user.lastBatalla)) / 60000)
        return m.reply(`💔 Ya peleaste hoy darling~\nVuelve en *${tiempo} minutos* no me dejes sola~`)
    }

    const enemigo = enemigos[Math.floor(Math.random() * enemigos.length)]
    const resultado = Math.random()

    let ganancia = 0
    let texto = ''

    if (resultado < 0.45) {
        ganancia = Math.floor(Math.random() * 250) + 150
        user.coins += ganancia
        texto = `💗 *¡GANASTE LA BATALLA DARLING!* 🌸\n\n` +
                `Derrotaste al ${enemigo} usando tu técnica secreta "Chupada Ultra"...\n` +
                `¡Te dio *${ganancia} ${moneda}* como recompensa! 😂`
    } else if (resultado < 0.75) {
        ganancia = Math.floor(Math.random() * 80) + 40
        user.coins += ganancia
        texto = `🌸 *¡EMPATE!* El ${enemigo} te dio un beso y te dejó *${ganancia} ${moneda}* por lástima~`
    } else {
        ganancia = Math.floor(Math.random() * 120) + 50
        user.coins = Math.max(0, user.coins - ganancia)
        texto = `💔 *¡PERDISTE LA BATALLA!* El ${enemigo} te dejó sin ropa y te robó *${ganancia} ${moneda}*... ay nooo~ 😭`
    }

    user.lastBatalla = Date.now()
    await database.save()

    return m.reply(texto + `\n\n💰 Saldo actual: *${user.coins} ${moneda}*`)
}

handler.help = ['batalla', 'rpgbatalla']
handler.tags = ['rpg', 'economy']
handler.command = ['batalla', 'rpgbatalla', 'battle']
handler.group = true

export default handler
