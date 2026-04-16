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

async function fetchPlayer(id) {
  const res = await fetch('https://www.youtube.com/youtubei/v1/player', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "es-ES,es;q=0.9"
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "ANDROID",
          clientVersion: "19.09.37"
        }
      },
      videoId: id
    })
  })

  return {
    status: res.status,
    json: await res.json()
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

    const api = await fetchPlayer(id)

    await m.reply(`📡 DEBUG\nAPI Status: ${api.status}`)

    const data = analyzeFormats(api.json)

    await m.reply(
      `📡 DEBUG\nFormats: ${data.totalFormats}\nAdaptive: ${data.totalAdaptive}`
    )

    await m.reply(
      `📡 DEBUG\nDirect URLs: ${data.direct.length}\nCipher: ${data.cipher.length}`
    )

    if (data.direct.length > 0) {
      await m.reply('📡 DEBUG\nVideo directo:\n' + data.direct[0])

      await conn.sendMessage(m.chat, {
        video: { url: data.direct[0] },
        caption: '✅ Video descargado'
      }, { quoted: m })

    } else if (data.cipher.length > 0) {
      await m.reply('📡 DEBUG\nRequiere descifrado (signatureCipher)')
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
    } else if (e.message === 'CIPHER') {
      msg += '⚠️ Video protegido\n💡 Requiere descifrado'
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