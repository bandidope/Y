import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    if (!global.db.data.chats[m.chat].nsfw && m.isGroup) {
        return m.reply('🚫 El contenido NSFW está desactivado en este grupo.\n\nUn admin puede activarlo con *#nable nsfw on*')
    }

    await m.react('🍬')

    try {
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=lesbian&json=1&limit=1`
        const res = await fetch(url)
        const json = await res.json()

        if (!json || json.length === 0) throw new Error('No image')

        const imageUrl = json[0].file_url

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: '*LESBIAN*'
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('❌ No se pudo obtener imagen. Prueba de nuevo.')
    }
}

handler.help = ['lesbian']
handler.tags = ['nsfw']
handler.command = ['lesbian']
handler.group = true

export default handler