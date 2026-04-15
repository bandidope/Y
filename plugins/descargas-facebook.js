import fetch from 'node-fetch'

function isFacebook(url = '') {
  return /facebook\.com|fb\.watch/i.test(url)
}

function clean(str = '') {
  return str
    .replace(/\\u0025/g, '%')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
}

async function fetchHTML(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(url, {
      signal: controller.signal,
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
  } finally {
    clearTimeout(timeout)
  }
}

function extractAll(html = '') {
  const results = new Set()

  const patterns = [
    /"playable_url_quality_hd":"([^"]+)"/g,
    /"playable_url":"([^"]+)"/g,
    /"browser_native_hd_url":"([^"]+)"/g,
    /https:\/\/video\.[^"]+\.fbcdn\.net[^"]+/g
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(html)) !== null) {
      results.add(clean(match[1] || match[0]))
    }
  }

  return Array.from(results)
}

function sortVideos(videos = []) {
  return videos.sort((a, b) => {
    const score = v => {
      if (/hd/i.test(v)) return 3
      if (/sd/i.test(v)) return 2
      return 1
    }
    return score(b) - score(a)
  })
}

function isBlocked(html = '') {
  return /login|checkpoint|error|unsupported browser/i.test(html)
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de Facebook')
  if (!isFacebook(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    const html = await fetchHTML(url)

    if (isBlocked(html)) {
      throw new Error('BLOCKED')
    }

    const videos = extractAll(html)

    if (!videos.length) {
      throw new Error('NO_VIDEO_FOUND')
    }

    const sorted = sortVideos(videos)
    const video = sorted[0]

    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: '✅ Video descargado'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    let msg = '❌ Error\n\n'

    if (e.name === 'AbortError') {
      msg += '⏱️ Tiempo de espera agotado (timeout)'
    } else if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n' + e.message
    } else if (e.message === 'BLOCKED') {
      msg += '🚫 Facebook bloqueó el scraping\n'
      msg += '💡 Requiere login o es contenido restringido'
    } else if (e.message === 'NO_VIDEO_FOUND') {
      msg += '❌ No se encontró el video\n'
      msg += '💡 Puede ser reel o formato no soportado'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['fb']

export default handler