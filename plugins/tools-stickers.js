const handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mimetype || ''

    if (!mime) {
        await m.react('🌸')
        return m.reply(`🌸 ¿Y mi media darling? 💗\nResponde a una imagen/video con\n*${usedPrefix}${command}*`)
    }

    if (!/image|video/.test(mime)) {
        await m.react('💔')
        return m.reply('💔 Solo imágenes y videos, mi amor\~')
    }

    await m.react('🍬')

    try {
        let media = await q.download()
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
        m.reply('💔 No pude procesar el sticker, darling...')
    }
}

handler.help = ['s', 'sticker']
handler.tags = ['stickers']
handler.command = ['s', 'sticker', 'stiker']

export default handler
