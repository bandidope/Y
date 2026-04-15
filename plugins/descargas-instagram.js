import fetch from 'node-fetch'

function isInstagram(url = '') {
  return /instagram\.com/i.test(url)
}

function clean(str = '') {
  return str
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
}

const agents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Linux; Android 10)",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
]

function getHeaders() {
  const agent = agents[Math.floor(Math.random() * agents.length)]
  const lang = ["es-ES,es;q=0.9", "en-US,en;q=0.9"][Math.floor(Math.random() * 2)]

  return {
    "User-Agent": agent,
    "Accept": "text/html,application/json",
    "Accept-Language": lang
  }
}

async function fetchHTML(url) {
  const headers = getHeaders()
  const res = await fetch(url, { headers })

  return {
    status: res.status,
    ok: res.ok,
    headers,
    html: await res.text()
  }
}

function extractHTML(html = '') {
  let results = []

  let jsonVideo = html.match(/"video_url":"([^"]+)"/g)
  if (jsonVideo) jsonVideo.forEach(v => results.push(clean(v.split('"')[3])))

  let og = html.match(/property="og:video" content="([^"]+)"/)
  if (og) results.push(clean(og[1]))

  let fallback = html.match(/https:\/\/video\.[^"]+\.cdninstagram\.com[^"]+/)
  if (fallback) results.push(clean(fallback[0]))

  return [...new Set(results)]
}

function extractAdvanced(html = '') {
  let results = []

  let video = html.match(/"video_versions":\[(.*?)\]/)
  if (video) {
    let urls = video[1].match(/"url":"([^"]+)"/g)
    if (urls) urls.forEach(u => results.push(clean(u.split('"')[3])))
  }

  let display = html.match(/"display_resources":\[(.*?)\]/)
  if (display) {
    let urls = display[1].match(/"src":"([^"]+)"/g)
    if (urls) urls.forEach(u => results.push(clean(u.split('"')[3])))
  }

  let dash = html.match(/"dash_manifest":"([^"]+)"/)
  if (dash) {
    let decoded = clean(dash[1])
    let videoUrl = decoded.match(/https:\/\/[^"]+\.mp4[^"]+/)
    if (videoUrl) results.push(videoUrl[0])
  }

  return [...new Set(results)]
}

function extractJSON(json = {}) {
  let results = []

  try {
    const media = json?.graphql?.shortcode_media

    if (media?.video_url) results.push(media.video_url)

    if (media?.edge_sidecar_to_children?.edges) {
      media.edge_sidecar_to_children.edges.forEach(e => {
        if (e.node?.video_url) results.push(e.node.video_url)
      })
    }

  } catch {}

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

    await m.reply('📡 DEBUG\nURL:\n' + url)

    const page = await fetchHTML(url)

    await m.reply(`📡 DEBUG\nStatus: ${page.status}\nOK: ${page.ok}`)
    await m.reply(`📡 DEBUG\nUser-Agent:\n${page.headers['User-Agent']}`)
    await m.reply(`📡 DEBUG\nHTML length: ${page.html.length}`)

    let videos = [
      ...extractHTML(page.html),
      ...extractAdvanced(page.html)
    ]

    await m.reply(`📡 DEBUG\nHTML videos: ${videos.length}`)

    if (!videos.length) {
      const apiUrl = url.includes('?') ? url + '&__a=1&__d=dis' : url + '?__a=1&__d=dis'

      await m.reply('📡 DEBUG\nIntentando JSON endpoint...')

      const api = await fetchHTML(apiUrl)

      await m.reply(`📡 DEBUG\nJSON Status: ${api.status}`)

      try {
        const json = JSON.parse(api.html)
        const jsonVideos = extractJSON(json)

        await m.reply(`📡 DEBUG\nJSON videos: ${jsonVideos.length}`)

        videos = jsonVideos
      } catch {
        await m.reply('📡 DEBUG\nJSON parse error')
      }
    }

    if (!videos.length) {
      throw new Error('NO_VIDEO_FOUND')
    }

    await m.reply(`📡 DEBUG\nVideo final:\n${videos[0]}`)

    await conn.sendMessage(m.chat, {
      video: { url: videos[0] },
      caption: '✅ Video de Instagram descargado'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    await m.reply(`📡 DEBUG ERROR\n${e.stack || e.message}`)

    let msg = '❌ Error\n\n'

    if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n' + e.message
    } else if (e.message === 'NO_VIDEO_FOUND') {
      msg += '🚫 Instagram bloqueó el scraping\n'
      msg += '💡 Puede requerir login o ser privado'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['ig']

export default handler