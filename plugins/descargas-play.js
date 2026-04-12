import fetch from 'node-fetch'
import yts from 'yt-search'

const API_KEY = 'causa-ec43262f206b3305'

const handler = async (msg, { conn, args, usedPrefix, command }) => {
  const query = args.join(' ').trim()

  if (!query) {
    return conn.sendMessage(
      msg.chat,
      { 
        text: `✳️ *Uso correcto:*\n\( {usedPrefix} \){command} <nombre del audio o canción>\n\nEjemplo: \( {usedPrefix} \){command} bad bunny un verano sin ti` 
      },
      { quoted: msg }
    )
  }

  await conn.sendMessage(
    msg.chat,
    { text: '🎧 *Buscando audio en YouTube...*' },
    { quoted: msg }
  )

  try {
    const search = await yts(query)
    
    if (!search.videos?.length) {
      throw new Error('No se encontraron resultados para esa búsqueda.')
    }

    const video = search.videos[0]

    // Llamada a la API de descarga
    const apiUrl = `https://rest.apicausas.xyz/api/v1/descargas/youtube?url=\( {encodeURIComponent(video.url)}&type=audio&apikey= \){API_KEY}`
    
    const res = await fetch(apiUrl)
    const data = await res.json()

    if (!data?.data?.download?.url) {
      throw new Error('No se pudo obtener el enlace de descarga.')
    }

    const title = data.data.info?.title || video.title || 'Audio de YouTube'
    const thumbnail = data.data.info?.thumbnail || video.thumbnail
    const author = video.author?.name || 'Desconocido'

    // Mensaje con información
    const info = `🎵 *${title}*\n\n` +
      `👤 *Canal:* ${author}\n` +
      `⏱️ *Duración:* ${video.timestamp || 'N/A'}\n` +
      `👀 *Vistas:* ${video.views?.toLocaleString() || 'N/A'}\n` +
      `🔗 ${video.url}`

    // Enviar thumbnail + info
    if (thumbnail) {
      await conn.sendMessage(
        msg.chat,
        { 
          image: { url: thumbnail }, 
          caption: info 
        },
        { quoted: msg }
      )
    } else {
      await conn.sendMessage(msg.chat, { text: info }, { quoted: msg })
    }

    // Enviar el audio
    await conn.sendMessage(
      msg.chat,
      {
        audio: { url: data.data.download.url },
        mimetype: 'audio/mpeg',
        fileName: `${sanitizeFilename(title)}.mp3`,
        ptt: false // Cambia a true si quieres que se envíe como nota de voz
      },
      { quoted: msg }
    )

  } catch (e) {
    console.error(e) // Para que veas el error en consola
    await conn.sendMessage(
      msg.chat,
      { 
        text: `❌ *Error al procesar tu solicitud:*\n${e.message || e}` 
      },
      { quoted: msg }
    )
  }
}

handler.help = ['play <título>', 'ytmp3 <título>']
handler.tags = ['download']
handler.command = ['play', 'ytmp3']   // ← Corregido aquí

export default handler

// Función para limpiar nombre de archivo
function sanitizeFilename(name = 'audio') {
  return name
    .replace(/[\\/:*?"<>|]+/g, '')   // Elimina caracteres inválidos
    .replace(/\s+/g, ' ')            // Normaliza espacios
    .trim()
    .slice(0, 100)
}