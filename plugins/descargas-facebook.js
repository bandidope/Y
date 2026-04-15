import fetch from 'node-fetch'

function isFacebook(url = '') {
  return /facebook\.com|fb\.watch/i.test(url)
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

  return {
    status: res.status,
    ok: res.ok,
    html: await res.text()
  }
}

function extractAll(html) {
  let results = []

  let hd = html.match(/"playable_url_quality_hd":"([^"]+)"/g)
  let sd = html.match(/"playable_url":"([^"]+)"/g)
  let browser = html.match(/"browser_native_hd_url":"([^"]+)"/g)
  let fallback = html.match(/https:\/\/video\.[^"]+\.fbcdn\.net[^"]+/g)

  return {
    hd: hd || [],
    sd: sd || [],
    browser: browser || [],
    fallback: fallback || [],
    all: [
      ...(hd || []).map(x => clean(x.split('"')[3])),
      ...(sd || []).map(x => clean(x.split('"')[3])),
      ...(browser || []).map(x => clean(x.split('"')[3])),
      ...(fallback || []).map(x => clean(x))
    ]
  }
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de Facebook')
  if (!isFacebook(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    await m.reply('📡 DEBUG\nURL:\n' + url)

    const { status, ok, html } = await fetchHTML(url)

    await m.reply(`📡 DEBUG\nHTTP Status: ${status}\nOK: ${ok}`)

    await m.reply(`📡 DEBUG\nHTML length: ${html.length}`)

    const blocked = /login|checkpoint|error|unsupported browser/i.test(html)
    await m.reply(`📡 DEBUG\nBlocked detect: ${blocked}`)

    const data = extractAll(html)

    await m.reply(
      `📡 DEBUG\n` +
      `HD: ${data.hd.length}\n` +
      `SD: ${data.sd.length}\n` +
      `Browser: ${data.browser.length}\n` +
      `Fallback: ${data.fallback.length}`
    )

    let videos = [...new Set(data.all)]

    await m.reply(`📡 DEBUG\nVideos encontrados: ${videos.length}`)

    if (videos.length > 0) {
      await m.reply(`📡 DEBUG\nPrimer video:\n${videos[0]}`)

      await conn.sendMessage(m.chat, {
        video: { url: videos[0] },
        caption: '✅ Video descargado'
      }, { quoted: m })

      await conn.sendMessage(m.chat, {
        react: { text: '✅', key: m.key }
      })

      return
    }

    let direct = html.match(/https:\/\/video\.[^"]+\.fbcdn\.net[^"]+/)

    await m.reply(`📡 DEBUG\nDirect fallback: ${direct ? 'SI' : 'NO'}`)

    if (direct) {
      let vid = clean(direct[0])

      await m.reply(`📡 DEBUG\nDirect URL:\n${vid}`)

      await conn.sendMessage(m.chat, {
        video: { url: vid },
        caption: '✅ Video descargado'
      }, { quoted: m })

      await conn.sendMessage(m.chat, {
        react: { text: '✅', key: m.key }
      })

      return
    }

    throw new Error('NO_VIDEO_FOUND')

  } catch (e) {
    await m.reply(`📡 DEBUG ERROR\n${e.stack || e.message}`)

    let msg = '❌ Error\n\n'

    if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n' + e.message
    } else if (e.message === 'NO_VIDEO_FOUND') {
      msg += '🚫 Facebook bloqueó el scraping\n'
      msg += '💡 Probablemente es reel o requiere login'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['fb']

export default handler