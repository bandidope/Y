import fetch from 'node-fetch'

function isTikTok(url = '') {
  return /tiktok\.com/i.test(url)
}

function clean(str) {
  return str?.replace(/\\u0026/g, '&').replace(/\\\//g, '/')
}

async function resolveURL(url) {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  })
  return res.url
}

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

function extractVideo(html) {
  let download = html.match(/"downloadAddr":"([^"]+)"/g)
  if (download && download.length > 0) {
    return clean(download[0].split('"')[3])
  }

  let play = html.match(/"playAddr":"([^"]+)"/g)
  if (play && play.length > 0) {
    return clean(play[0].split('"')[3])
  }

  let fallback = html.match(/https:\/\/[^"]+\.tiktokcdn\.com[^"]+\.mp4[^"]*/g)
  if (fallback && fallback.length > 0) {
    return clean(fallback[0])
  }

  return null
}

let handler = async (m, { conn, args }) => {
  let url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de TikTok')
  if (!isTikTok(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    if (/vm\.tiktok\.com|vt\.tiktok\.com/i.test(url)) {
      url = await resolveURL(url)
    }

    const html = await fetchHTML(url)
    const video = extractVideo(html)

    if (video) {
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption: '✅ Video descargado'
      }, { quoted: m })

      await conn.sendMessage(m.chat, {
        react: { text: '✅', key: m.key }
      })

      return
    }

    throw new Error('NO_VIDEO_FOUND')

  } catch (e) {
    let msg = '❌ Error\n\n'

    if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n' + e.message
    } else if (e.message === 'NO_VIDEO_FOUND') {
      msg += '🚫 No se encontró el video\n'
      msg += '💡 Puede ser privado o restringido'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['tt', 'tiktok']

export default handler