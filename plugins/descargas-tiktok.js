import fetch from 'node-fetch'

function isTikTok(url = '') {
  return /tiktok\.com/i.test(url)
}

async function fetchTikWM(url) {
  const res = await fetch('https://www.tikwm.com/api/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `url=${encodeURIComponent(url)}`
  })

  const json = await res.json()

  return json?.data?.play || json?.data?.wmplay || null
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de TikTok')
  if (!isTikTok(url)) return m.reply('❌ Link inválido')

  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🕒', key: m.key }
    })

    await m.reply('📡 Procesando TikTok...')

    const video = await fetchTikWM(url)

    if (!video) throw new Error('NO_VIDEO')

    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: '✅ Video de TikTok descargado'
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })

  } catch (e) {
    let msg = '❌ Error\n\n'

    if (e.message === 'NO_VIDEO') {
      msg += '❌ No se pudo obtener el video'
    } else {
      msg += '⚠️ Error inesperado\n' + e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['tt', 'tiktok']

export default handler