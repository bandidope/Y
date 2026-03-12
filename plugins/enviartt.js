import fetch from 'node-fetch'

const API_KEY  = 'causa-ec43262f206b3305'
const API_BASE = 'https://rest.apicausas.xyz/api/v1/descargas/tiktok'

let handler = async (m, { conn, args }) => {
    let url = args[0] || (m.quoted && m.quoted.text ? m.quoted.text.trim() : '')
    
    if (!url || !url.includes('tiktok.com')) {
        await m.react('🌸')
        return m.reply('💗 Pega el link de TikTok después del comando darling~\nEjemplo: *#enviartt https://vt.tiktok.com/...*')
    }

    await m.react('🍬')

    try {
        // CORRECCIÓN 1: Sintaxis arreglada (${} en lugar de \( {} )
        const res  = await fetch(`${API_BASE}?url=${encodeURIComponent(url)}&apikey=${API_KEY}`)
        const json = await res.json()

        if (!json.status || !json.data?.download?.url) {
            throw new Error('La API no devolvió la URL del video. Verifica la API Key o el link.')
        }

        // Descargamos el buffer del video
        const videoRes = await fetch(json.data.download.url)
        const videoBuffer = await videoRes.buffer() // Nota: Si usas node-fetch v3, cambia esto por Buffer.from(await videoRes.arrayBuffer())

        // TU CANAL OFICIAL
        const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'

        // CORRECCIÓN 2: Se añade mimetype explícito, necesario muchas veces para Canales
        await conn.sendMessage(CANAL, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: `💗 *TikTok enviado por ${m.pushName}*\n\n` +
                     `✨ Autor: ${json.data.autor || 'TikTok'}\n` +
                     `📝 Título: ${json.data.titulo || 'Sin descripción'}`
        })

        await m.reply('✅ Video enviado correctamente a tu canal oficial darling~ 💕')
        await m.react('💗')

    } catch (e) {
        console.error('ENVIARTT ERROR:', e)
        await m.react('💔')
        // Ahora el bot te dirá el error exacto en el chat para que sea más fácil debugear
        m.reply(`💔 Uy darling... hubo un error:\n_${e.message}_\nPrueba con otro TikTok o revisa la consola.`)
    }
}

handler.help = ['enviartt <link>']
handler.tags = ['descargas']
handler.command = ['enviartt', 'ttsend', 'enviartiktok']
handler.owner = true

export default handler
