import fetch from 'node-fetch'

function isInstagram(url = '') {
  return /instagram\.com/i.test(url)
}

function clean(str) {
  return str?.replace(/\\u0025/g, '%').replace(/\\\//g, '/')
}

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

function extractVideo(html) {
  let results = []

  let video1 = html.match(/"video_url":"([^"]+)"/g)
  if (video1) video1.forEach(x => results.push(clean(x.split('"')[3])))

  let video2 = html.match(/"video_versions":\[\{"type":[^}]+,"url":"([^"]+)"/g)
  if (video2) video2.forEach(x => {
    let m = x.match(/"url":"([^"]+)"/)
    if (m) results.push(clean(m[1]))
  })

  let fallback = html.match(/https:\/\/[^"]+\.cdninstagram\.com[^"]+\.mp4[^"]*/g)
  if (fallback) fallback.forEach(x => results.push(clean(x)))

  return [...new Set(results)]
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de Instagram')
  if (!isInstagram(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    const html = await fetchHTML(url)
    const videos = extractVideo(html)

    if (videos.length > 0) {
      await conn.sendMessage(m.chat, {
        video: { url: videos[0] },
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
      msg += '💡 Puede ser privado o requerir login'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['ig']

export default handler