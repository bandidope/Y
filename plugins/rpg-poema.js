import { database } from '../lib/database.js'

const poemas = [
    "En tus ojos encontré el universo que siempre soñé.\nY en tu sonrisa, la razón por la que sigo aquí.",
    "Si el amor fuera un océano, yo me ahogaría en ti sin pedir rescate.",
    "Eres el silencio que calma mi tormenta y el latido que me mantiene vivo.",
    "No te busqué, te encontré. Y desde entonces, el mundo tiene más sentido.",
    "Contigo aprendí que el cielo no está arriba, sino en tus ojos.",
    "Aunque el tiempo nos separe, mi alma siempre volverá a buscarte.",
    "Tú no eres un capítulo de mi vida, eres el libro entero.",
    "En cada latido mío hay un pedacito de ti que nunca se irá.",
    "Si pudiera pedir un deseo, pediría despertarme cada día a tu lado.",
    "Eres la poesía que la vida escribió para mí sin que yo lo supiera."
]

let handler = async (m, { conn }) => {
    await m.react('🍬')

    const poemaRandom = poemas[Math.floor(Math.random() * poemas.length)]

    // Enviar al chat
    await conn.sendMessage(m.chat, {
        text: `💗 *Poema para ti, darling\~* 🌸\n\n${poemaRandom}\n\n— Zero Two 💕`
    }, { quoted: m })

    // Enviar al canal oficial (rcanal)
    const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'
    await conn.sendMessage(CANAL, {
        text: `💗 *Poema enviado por \( {m.pushName || 'alguien'}*\n\n \){poemaRandom}\n\n— Zero Two 💕`
    })

    await m.react('💗')
}

handler.help = ['poema']
handler.tags = ['fun']
handler.command = ['poema', 'frase', 'poemas']

export default handler