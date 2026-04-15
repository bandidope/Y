import fetch from 'node-fetch'

function isTikTok(url = '') {
  return /tiktok\.com/i.test(url)
}

function getID(url = '') {
  const match = url.match(/video\/(\d+)/)
  return match ? match[1] : null
}

async function resolveURL(url) {
  const res = await fetch(url, { redirect: 'follow' })
  return res.url
}

async function fetchAPI(id) {
  const api = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`

  try {
    const res = await fetch(api, {
      headers: {
        "User-Agent": "com.ss.android.ugc.trill/494+",
        "Accept": "application/json"
      }
    })

    const text = await res.text()

    if (!text.startsWith('{')) throw new Error('INVALID_JSON')

    const json = JSON.parse(text)

    const item = json?.aweme_list?.[0]

    return (
      item?.video?.play_addr?.url_list?.[0] ||
      item?.video?.download_addr?.url_list?.[0]
    )

  } catch {
    return null
  }
}

async function fetchOembed(url) {
  const api = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`

  const res = await fetch(api)
  if (!res.ok) return null

  const json = await res.json()

  const html = json?.html || ''

  const match = html.match(/src="([^"]+)"/)

  return match ? match[1] : null
}

let handler = async (m, { conn, args }) => {
  const input = args[0]

  if (!input) return m.reply('⚠️ Ingresa un link de TikTok')
  if (!isTikTok(input)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    await m.reply('📡 DEBUG\nResolviendo URL...')

    const finalUrl = await resolveURL(input)

    await m.reply('📡 DEBUG\nFinal URL:\n' + finalUrl)

    const id = getID(finalUrl)

    await m.reply('📡 DEBUG\nVideo ID:\n' + id)

    let video = await fetchAPI(id)

    await m.reply('📡 DEBUG\nAPI interna:\n' + (video ? 'OK' : 'FALLÓ'))

    if (!video) {
      await m.reply('📡 DEBUG\nIntentando oEmbed...')

      video = await fetchOembed(finalUrl)

      await m.reply('📡 DEBUG\noEmbed:\n' + (video ? 'OK' : 'FALLÓ'))
    }

    if (!video) throw new Error('NO_VIDEO')

    await m.reply('📡 DEBUG\nVideo final:\n' + video)

    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: '✅ Video de TikTok descargado'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    await m.reply(`📡 DEBUG ERROR\n${e.stack || e.message}`)

    let msg = '❌ Error\n\n'

    if (e.message === 'NO_VIDEO') {
      msg += '❌ No se pudo obtener el video\n'
      msg += '💡 TikTok bloqueó todos los métodos'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['tt', 'tiktok']

export default handler