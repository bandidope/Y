import fetch from 'node-fetch'

function isYouTube(url = '') {
  return /youtube\.com|youtu\.be/i.test(url)
}

function getID(url = '') {
  let match = url.match(/v=([^&]+)/)
  if (match) return match[1]

  match = url.match(/youtu\.be\/([^?]+)/)
  return match ? match[1] : null
}

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "es-ES,es;q=0.9"
    }
  })

  return {
    status: res.status,
    ok: res.ok,
    html: await res.text()
  }
}

function extractJSON(html = '') {
  const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/)

  if (!match) return null

  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

function analyzeFormats(json = {}) {
  const formats = json?.streamingData?.formats || []
  const adaptive = json?.streamingData?.adaptiveFormats || []

  let direct = []
  let cipher = []

  formats.forEach(f => {
    if (f.url) direct.push(f.url)
    if (f.signatureCipher) cipher.push(f.signatureCipher)
  })

  adaptive.forEach(f => {
    if (f.url) direct.push(f.url)
    if (f.signatureCipher) cipher.push(f.signatureCipher)
  })

  return {
    direct,
    cipher,
    totalFormats: formats.length,
    totalAdaptive: adaptive.length
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

    const watch = `https://www.youtube.com/watch?v=${id}`

    const page = await fetchHTML(watch)

    await m.reply(`📡 DEBUG\nStatus: ${page.status}\nOK: ${page.ok}`)
    await m.reply(`📡 DEBUG\nHTML length: ${page.html.length}`)

    const json = extractJSON(page.html)

    await m.reply('📡 DEBUG\nJSON encontrado:\n' + !!json)

    if (!json) throw new Error('NO_JSON')

    const data = analyzeFormats(json)

    await m.reply(
      `📡 DEBUG\nFormats: ${data.totalFormats}\nAdaptive: ${data.totalAdaptive}`
    )

    await m.reply(
      `📡 DEBUG\nDirect URLs: ${data.direct.length}\nCipher: ${data.cipher.length}`
    )

    if (data.direct.length > 0) {
      await m.reply('📡 DEBUG\nVideo directo encontrado:\n' + data.direct[0])

      await conn.sendMessage(m.chat, {
        video: { url: data.direct[0] },
        caption: '✅ Video descargado (directo)'
      }, { quoted: m })

    } else if (data.cipher.length > 0) {
      await m.reply('📡 DEBUG\nSe requiere descifrado (signatureCipher)')

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

    if (e.message === 'NO_ID') {
      msg += '❌ No se pudo obtener el ID'
    } else if (e.message === 'NO_JSON') {
      msg += '❌ YouTube bloqueó el JSON'
    } else if (e.message === 'CIPHER') {
      msg += '⚠️ Video protegido\n💡 Requiere descifrar firma'
    } else if (e.message === 'NO_VIDEO') {
      msg += '❌ No se encontró video'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['yt']

export default handler