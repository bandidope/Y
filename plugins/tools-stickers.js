const handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!mime) {
        await m.react('🌸')
        return m.reply(`🌸 ¿Y mi media darling? 💗\nResponde a una imagen o video con\n*${usedPrefix}${command}*`)
    }

    await m.react('🍬')

    try {
        let { data } = await conn.getFile(await q.download())
        let packname = global.packname || '💗 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 💗'
        let author = global.author || '© Zore Two'

        await conn.sendImageAsSticker(m.chat, data, m, { 
            packname: packname, 
            author: author 
        })
        
        await m.react('💗')

    } catch (e) {
        console.error(e)
        await m.react('💔')
        m.reply('💔 Darling, no pude enviarte el sticker. Intenta de nuevo.')
    }
}

handler.help = ['s', 'sticker', 'stiker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker', 'stiker']

export default handler
