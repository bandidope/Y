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
        let base64 = `data:image/jpeg;base64,${img.toString('base64')}`

        // API 1 - Akuari (mejor actual)
        let res = await fetch('https://api.akuari.my.id/image/upscale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 })
        })
        let json = await res.json()
        let url = json.result || json.url

        // API 2 - FGMods (backup)
        if (!url) {
            res = await fetch('https://api.fgmods.xyz/api/image/upscale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            })
            json = await res.json()
            url = json.result || json.url
        }

        // API 3 - Betabotz (último intento)
        if (!url) {
            res = await fetch('https://api.betabotz.org/api/tools/remini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: base64 })
            })
            json = await res.json()
            url = json.url
        }

        if (!url) throw new Error('Todas las APIs fallaron')

        await conn.sendMessage(m.chat, {
            image: { url: url },
            caption: '💗 *¡Imagen mejorada con éxito!* 🌸'
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error('HD ERROR:', e.message || e)
        await m.react('❌')
        m.reply('💔 *Los servidores de HD están saturados.*\n\nPrueba enviando la foto de nuevo.')
    }
}

handler.help = ['hd', 'remini', 'upscale']
handler.tags = ['tools']
handler.command = ['hd', 'remini', 'upscale']
handler.register = true

export default handler