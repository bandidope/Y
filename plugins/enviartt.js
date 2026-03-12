import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    let url = args[0] || (m.quoted && m.quoted.text ? m.quoted.text.trim() : '')
    
    if (!url || !url.includes('tiktok.com')) {
        await m.react('🌸')
        return m.reply('💗 Pega el link de TikTok después del comando darling\~\nEjemplo: *#enviartt https://vm.tiktok.com/...*')
    }

    await m.react('🍬')

    try {
        // Primera petición a tu API
        const apiUrl = `https://rest.apicausas.xyz/api/tiktok?url=${encodeURIComponent(url)}`
        const res = await fetch(apiUrl)
        const json = await res.json()

        if (!json.data?.video) {
            throw new Error('La API no devolvió video')
        }

        const videoUrl = json.data.video

        // Descarga del video con timeout
        const videoRes = await fetch(videoUrl, { timeout: 15000 })
        if (!videoRes.ok) throw new Error('Error al descargar el video')

        const videoBuffer = await videoRes.buffer()

        // TU CANAL OFICIAL
        const CANAL = '0029Vb6p68rF6smrH4Jeay3Y@newsletter'

        await conn.sendMessage(CANAL, {
            video: videoBuffer,
            caption: `💗 *TikTok enviado por \( {m.pushName}*\n\n \){json.data.title || 'Sin título'}`
        })

        await m.reply('✅ Video enviado correctamente a tu canal oficial darling\~ 💕')
        await m.react('💗')

    } catch (e) {
        console.error('ENVIARTT ERROR:', e.message || e)
        await m.react('💔')
        m.reply('💔 Uy darling... no pude enviar el video esta vez\~\n' +
                `Error: ${e.message || 'Desconocido'}\n` +
                'Prueba con otro link o avísame si sigue fallando')
    }
}

handler.help = ['enviartt <link>']
handler.tags = ['descargas']
handler.command = ['enviartt', 'ttsend', 'enviartiktok']
handler.owner = true

export default handler