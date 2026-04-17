import fetch from 'node-fetch'

function isYouTube(url = '') {
  return /youtube\.com|youtu\.be/i.test(url)
}

function getID(url = '') {
  let m = url.match(/v=([^&]+)/)
  if (m) return m[1]
  m = url.match(/youtu\.be\/([^?]+)/)
  return m ? m[1] : null
}

async function fetchHTML(url) {
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "es-ES,es;q=0.9"
    }
  })
  return await r.text()
}

function extractConfig(html = '') {
  const key = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1]
  const sts = html.match(/"signatureTimestamp":(\d+)/)?.[1]
  return { key, sts }
}

async function fetchPlayer(id, key, sts, mode = 'ANDROID') {
  let body
  let headers

  if (mode === 'ANDROID') {
    headers = {
      "Content-Type": "application/json",
      "User-Agent": "com.google.android.youtube/19.09.37",
      "X-YouTube-Client-Name": "3",
      "X-YouTube-Client-Version": "19.09.37",
      "Origin": "https://www.youtube.com"
    }

    body = {
      context: {
        client: {
          clientName: "ANDROID",
          clientVersion: "19.09.37",
          androidSdkVersion: 30,
          hl: "es",
          gl: "MX"
        }
      },
      playbackContext: {
        contentPlaybackContext: {
          signatureTimestamp: Number(sts || 0)
        }
      },
      videoId: id
    }
  } else {
    headers = {
      "Content-Type": "application/json",
      "User-Agent": "com.google.ios.youtube/19.09.3",
      "X-YouTube-Client-Name": "5",
      "X-YouTube-Client-Version": "19.09.3",
      "Origin": "https://www.youtube.com"
    }

    body = {
      context: {
        client: {
          clientName: "IOS",
          clientVersion: "19.09.3",
          deviceModel: "iPhone14,3",
          hl: "es",
          gl: "MX"
        }
      },
      videoId: id
    }
  }

  const r = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${key}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })

  return {
    status: r.status,
    json: await r.json()
  }
}

function analyze(json = {}) {
  const f = json?.streamingData?.formats || []
  const a = json?.streamingData?.adaptiveFormats || []

  const direct = []
  const cipher = []

  f.forEach(x => {
    if (x.url) direct.push(x.url)
    if (x.signatureCipher) cipher.push(x.signatureCipher)
  })

  a.forEach(x => {
    if (x.url) direct.push(x.url)
    if (x.signatureCipher) cipher.push(x.signatureCipher)
  })

  return {
    direct,
    cipher,
    f: f.length,
    a: a.length
  }
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de YouTube')
  if (!isYouTube(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    await m.reply('📡 DEBUG\nURL:\n' + url)

    const id = getID(url)
    await m.reply('📡 DEBUG\nVideo ID:\n' + id)

    if (!id) throw new Error('NO_ID')

    const html = await fetchHTML(`https://www.youtube.com/watch?v=${id}`)
    const cfg = extractConfig(html)

    await m.reply(`📡 DEBUG\nAPI KEY: ${!!cfg.key}`)
    await m.reply(`📡 DEBUG\nSTS: ${cfg.sts || 'null'}`)

    if (!cfg.key) throw new Error('NO_KEY')

    let api = await fetchPlayer(id, cfg.key, cfg.sts, 'ANDROID')

    await m.reply(`📡 DEBUG\nANDROID Status: ${api.status}`)

    let data = analyze(api.json)

    await m.reply(`📡 DEBUG\nA Formats: ${data.f} | A Adaptive: ${data.a}`)

    if (!data.direct.length && !data.cipher.length) {
      await m.reply('📡 DEBUG\nFallback a IOS...')

      api = await fetchPlayer(id, cfg.key, cfg.sts, 'IOS')

      await m.reply(`📡 DEBUG\nIOS Status: ${api.status}`)

      data = analyze(api.json)

      await m.reply(`📡 DEBUG\nI Formats: ${data.f} | I Adaptive: ${data.a}`)
    }

    await m.reply(`📡 DEBUG\nDirect: ${data.direct.length} | Cipher: ${data.cipher.length}`)

    if (data.direct.length) {
      await m.reply('📡 DEBUG\nURL:\n' + data.direct[0])

      await conn.sendMessage(m.chat, {
        video: { url: data.direct[0] },
        caption: '✅ Video descargado'
      }, { quoted: m })
    } else if (data.cipher.length) {
      throw new Error('CIPHER')
    } else {
      throw new Error('NO_VIDEO')
    }

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    await m.reply(`📡 DEBUG ERROR\n${e.stack || e.message}`)

    let msg = '❌ Error\n\n'

    if (e.message === 'NO_ID') msg += 'ID inválido'
    else if (e.message === 'NO_KEY') msg += 'Sin API KEY'
    else if (e.message === 'CIPHER') msg += '⚠️ Requiere descifrado'
    else if (e.message === 'NO_VIDEO') msg += '❌ No se encontró video'
    else msg += e.message

    await m.reply(msg)
  }
}

handler.command = ['yt']

export default handler