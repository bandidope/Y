import fetch from 'node-fetch'

const API_KEY  = 'causa-ec43262f206b3305'
const API_BASE = 'https://rest.apicausas.xyz/api/v1/descargas/tiktok'

let handler = async (m, { conn, args }) => {
    let url = args[0] || (m.quoted && m.quoted.text ? m.quoted.text.trim() : '')
    
    if (!url || !url.includes('tiktok.com')) {
        await m.react('🌸')
        return m.reply('💗 Pega el link de TikTok después del comando darling\~\nEjemplo: *#enviartt https://vt.tiktok.com/...*')
    }

    await m.react('🍬')

    try {
        const res  = await fetch(`\( {API_BASE}?url= \){encodeURIComponent(url)}&apikey=${API_KEY}`)
        const json = await res.json()

        if (!json.status || !json.data?.download?.url) {
            throw new Error('No se encontró video')
        }

        const videoBuffer = await fetch(json.data.download.url).then(r => r.buffer())

        // TU CANAL OFICIAL
        const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'

        await conn.sendMessage(CANAL, {
            video: videoBuffer,
            caption: `💗 *TikTok enviado por ${m.pushName}*\n\n` +
                     `✨ Autor: ${json.data.autor || 'TikTok'}\n` +
                     `📝 Título: ${json.data.titulo || 'Sin descripción'}`
        })

        await m.reply('✅ Video enviado correctamente a tu canal oficial darling\~ 💕')
        await m.react('💗')

    } catch (e) {
        console.error('ENVIARTT ERROR:', e.message || e)
        await m.react('💔')
        m.reply('💔 Uy darling... este link no funcionó con mi API\~\nPrueba con otro TikTok')
    }
}

handler.help = ['enviartt <link>']
handler.tags = ['descargas']
handler.command = ['enviartt', 'ttsend', 'enviartiktok']
handler.owner = true

export default handler