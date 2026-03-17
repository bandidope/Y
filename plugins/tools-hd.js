import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime || !mime.startsWith('image/')) {
        await m.react('🌸')
        return m.reply('🌸 *¡Darling, necesito una imagen!* 🌸\n\nResponde a una foto con *#hd*')
    }

    await m.react('⏳')

    try {
        let img = await q.download()

        // Primera API (mejor calidad)
        let response = await fetch('https://api.itsrose.rest/image/unblur', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: `data:image/jpeg;base64,${img.toString('base64')}`,
                server: 'google'
            })
        })

        let json = await response.json()
        let imageUrl = json.result?.url

        // Backup si falla
        if (!imageUrl) {
            let backup = await fetch('https://skizo.tech/api/remini', {
                method: 'POST',
                body: JSON.stringify({ url: `data:image/jpeg;base64,${img.toString('base64')}` })
            })
            let backupJson = await backup.json()
            imageUrl = backupJson.url
        }

        if (!imageUrl) throw new Error('No se pudo mejorar')

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: '💗 *¡Imagen mejorada con éxito!* 🌸'
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('💔 *Los servidores de HD están saturados.*\n\nPrueba enviando la foto de nuevo.')
    }
}

handler.help = ['hd', 'remini', 'upscale']
handler.tags = ['tools']
handler.command = ['hd', 'remini', 'upscale']
handler.register = true

export default handler