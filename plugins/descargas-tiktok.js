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

  const res = await fetch(api, {
    headers: {
      "User-Agent": "com.ss.android.ugc.trill/494+",
      "Accept": "application/json"
    }
  })

  return {
    status: res.status,
    json: await res.json()
  }
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

    if (!id) throw new Error('NO_ID')

    await m.reply('📡 DEBUG\nVideo ID:\n' + id)

    const api = await fetchAPI(id)

    await m.reply(`📡 DEBUG\nAPI Status: ${api.status}`)

    const item = api.json?.aweme_list?.[0]

    const video =
      item?.video?.play_addr?.url_list?.[0] ||
      item?.video?.download_addr?.url_list?.[0]

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

    if (e.message === 'NO_ID') {
      msg += '❌ No se pudo obtener el ID del video'
    } else if (e.message === 'NO_VIDEO') {
      msg += '❌ TikTok bloqueó completamente el video'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['tt', 'tiktok']

export default handler