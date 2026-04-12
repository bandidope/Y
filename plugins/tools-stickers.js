const handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!mime) {
        await m.react('🌸')
        return m.reply(`🌸 ¿Y mi media darling? 💗\nResponde a una imagen o video con\n*${usedPrefix}${command}*`)
    }

    await m.react('🍬')

    try {
        let media = await q.download()
        if (!media) throw new Error('No media')

        let packname = global.packname || '💗 𝒁𝒆𝒓𝒐 𝑻𝒘𝒐 💗'
        let author = global.author || '© Zore Two'

        await conn.sendImageAsSticker(m.chat, media, m, { 
            packname: packname, 
            author: author 
        })
        
        await m.react('💗')

    } catch (e) {
        console.error(e)
        await m.react('💔')
        m.reply('💔 Darling, no pude procesar el sticker. Asegúrate de tener las librerías de stickers instaladas.')
    }
}

handler.help = ['s', 'sticker', 'stiker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker', 'stiker']

export default handler
