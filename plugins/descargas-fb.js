import fetch from 'node-fetch'

function isFacebook(url = '') {
  return /facebook\.com|fb\.watch/i.test(url)
}

function toMbasic(url) {
  return url.replace('www.facebook.com', 'mbasic.facebook.com')
}

function clean(str) {
  return str?.replace(/\\u0025/g, '%').replace(/\\\//g, '/')
}

async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "es-ES,es;q=0.9"
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

function extractVideo(html) {
  let hd = html.match(/"playable_url_quality_hd":"([^"]+)"/)
  let sd = html.match(/"playable_url":"([^"]+)"/)
  if (hd) return clean(hd[1])
  if (sd) return clean(sd[1])
  return null
}

function extractMbasic(html) {
  let match = html.match(/<a[^>]+href="([^"]+)"[^>]*>Ver video<\/a>/i)
  if (match) return 'https://mbasic.facebook.com' + match[1].replace(/&amp;/g, '&')
  return null
}

let handler = async (m, { conn, args }) => {
  const url = args[0]

  if (!url) return m.reply('⚠️ Ingresa un link de Facebook')
  if (!isFacebook(url)) return m.reply('❌ Link inválido')

  try {
    await m.reply('🧪 DEBUG: Iniciando descarga...')

    const html = await fetchHTML(url)
    await m.reply(`🧪 DEBUG: HTML cargado (${html.length} chars)`)

    let video = extractVideo(html)

    if (video) {
      await m.reply('🧪 DEBUG: Video encontrado en HTML principal (HD/SD)')
      await conn.sendMessage(m.chat, {
        video: { url: video },
        caption: '✅ Video descargado'
      }, { quoted: m })
      return
    }

    await m.reply('🧪 DEBUG: No encontrado, probando mbasic...')

    const mbasicUrl = toMbasic(url)
    const html2 = await fetchHTML(mbasicUrl)
    await m.reply(`🧪 DEBUG: mbasic cargado (${html2.length} chars)`)

    const next = extractMbasic(html2)

    if (!next) {
      await m.reply('🧪 DEBUG: No se encontró link en mbasic')
      throw new Error('NO_LINK_MBASIC')
    }

    await m.reply('🧪 DEBUG: Entrando a página de video mbasic...')

    const html3 = await fetchHTML(next)
    const video2 = extractVideo(html3)

    if (video2) {
      await m.reply('🧪 DEBUG: Video encontrado en mbasic')
      await conn.sendMessage(m.chat, {
        video: { url: video2 },
        caption: '✅ Video descargado'
      }, { quoted: m })
      return
    }

    await m.reply('🧪 DEBUG: Tampoco se encontró video en mbasic final')
    throw new Error('VIDEO_NOT_FOUND')

  } catch (e) {
    let msg = '❌ Error\n\n'

    if (e.message.includes('HTTP')) {
      msg += '🌐 Error de conexión\n'
      msg += e.message
    } else if (e.message === 'NO_LINK_MBASIC') {
      msg += '🔍 mbasic no devolvió enlace\n'
      msg += '💡 Puede ser reel o privado'
    } else if (e.message === 'VIDEO_NOT_FOUND') {
      msg += '🚫 No se encontró video\n'
      msg += '💡 Probablemente es reel o protegido'
    } else {
      msg += '⚠️ Error inesperado\n'
      msg += e.message
    }

    await m.reply(msg)
  }
}

handler.command = ['fb']

export default handler