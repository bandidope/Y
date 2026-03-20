import fetch from 'node-fetch'

function isInstagram(url = '') {
  return /instagram\.com/i.test(url)
}

function clean(str = '') {
  return str
    .replace(/\\u0026/g, '&')
    .replace(/\\u003d/g, '=')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
}

function isValidVideo(url = '') {
  return url.includes('.mp4') && url.includes('cdninstagram')
}

function headers() {
  return {
    "User-Agent": "Mozilla/5.0 (Linux; Android 11)",
    "Accept": "*/*",
    "Accept-Language": "es-ES,es;q=0.9",
    "Referer": "https://www.instagram.com/"
  }
}

async function fetchText(url) {
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) return null
  try {
    return await res.json()
  } catch {
    return null
  }
}

function extractFromHTML(html) {
  let results = []

  let og = html.match(/property="og:video" content="([^"]+)"/)
  if (og) results.push(clean(og[1]))

  let json = html.match(/"video_url":"([^"]+)"/g)
  if (json) {
    json.forEach(x => {
      results.push(clean(x.split('"')[3]))
    })
  }

  return [...new Set(results)]
}

async function tryEmbed(url) {
  try {
    let api = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`
    let data = await fetchJSON(api)
    return data?.thumbnail_url || null
  } catch {
    return null
  }
}

async function tryA1(url) {
  try {
    let api = url.split('?')[0] + '?__a=1&__d=dis'
    let data = await fetchJSON(api)

    let media = data?.graphql?.shortcode_media

    if (media?.video_url) return media.video_url

    if (media?.edge_sidecar_to_children?.edges) {
      for (let x of media.edge_sidecar_to_children.edges) {
        if (x.node.video_url) return x.node.video_url
      }
    }

    return null
  } catch {
    return null
  }
}

async function checkVideo(url) {
  try {
    let res = await fetch(url, { method: 'HEAD' })
    let size = res.headers.get('content-length')
    return size && parseInt(size) > 50000
  } catch {
    return false
  }
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de Instagram')
  if (!isInstagram(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    let videos = []

    let html = await fetchText(url)
    videos.push(...extractFromHTML(html))

    if (videos.length === 0) {
      let a1 = await tryA1(url)
      if (a1) videos.push(a1)
    }

    if (videos.length === 0) {
      let embed = await tryEmbed(url)
      if (embed) videos.push(embed)
    }

    videos = videos.filter(v => isValidVideo(v))

    let valid = null

    for (let v of videos) {
      if (await checkVideo(v)) {
        valid = v
        break
      }
    }

    if (!valid) throw new Error('NO_VIDEO')

    await conn.sendMessage(m.chat, {
      video: { url: valid },
      caption: '✅ Video descargado AUTO'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    let msg = '❌ Error\n\n'

    if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n' + e.message
    } else {
      msg += '🚫 Instagram bloqueó el scraping\n'
      msg += '💡 Intenta otro link o más tarde'
    }

    await m.reply(msg)
  }
}

handler.command = ['ig']

export default handler