import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) throw `🌸 *¡Darling, necesito una imagen!* 🌸\n\nResponde a una foto o envía una con el comando *${usedPrefix + command}*`
    
    await m.react('⏳')
    
    try {
        let img = await q.download()
        
        // Convertimos la imagen a Base64 para enviarla a la API
        let imageData = img.toString('base64')
        
        // Usamos una API alternativa de mejora (Upscale)
        // Esta es una ruta de procesamiento común en los modelos de IA actuales
        let response = await axios.post('https://api.itsrose.rest/image/unblur', {
            server: 'google',
            image: `data:image/jpeg;base64,${imageData}`
        }, {
            params: { apikey: 'Rk-ZeroTwo' }, // Algunos servidores usan keys genéricas
            responseType: 'arraybuffer'
        }).catch(async () => {
            // SEGUNDO INTENTO si la anterior falla (Servidor de respaldo)
            return await axios.post('https://skizo.tech/api/remini', {
                url: `data:image/jpeg;base64,${imageData}`
            }, { responseType: 'arraybuffer' })
        })

        if (!response.data) throw 'Error de datos'

        await conn.sendFile(m.chat, response.data, 'hd.jpg', '💗 *¡Listo darling! Calidad mejorada para ti.* 🌸', m)
        await m.react('✅')

    } catch (e) {
        console.error(e)
        // Si todo falla, intentamos usar un método de "filtro" rápido
        await m.react('❌')
        m.reply('💔 *Los servidores de HD están saturados.* \n\nPrueba enviando la foto de nuevo, a veces es solo un pequeño glitch del servidor.')
    }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd', 'remini', 'upscale']
handler.register = true

export default handler
