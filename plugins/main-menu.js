import fs from 'fs'
import { join } from 'path'

const handler = async (m, { conn, usedPrefix }) => {
    try {
        // --- 1. CONFIGURACIÓN E IDENTIDAD (De settings.js) ---
        let nombreBot = global.botname || 'Zero Two'
        let bannerFinal = global.menuImage || 'https://qu.ax/ZpYp.jpg'
        
        const botActual = conn.user?.jid?.split('@')[0]?.replace(/\D/g, '')
        const configPath = join('./JadiBots', botActual || '', 'settings.js')

        if (botActual && fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath))
                if (config.name) nombreBot = config.name
                if (config.banner) bannerFinal = config.banner
            } catch (e) { console.error("Error en JadiBot Config:", e) }
        }

        // --- 2. RELOJ OPTIMIZADO (Senior Choice) ---
        const hora = new Date().toLocaleTimeString('en-US', { 
            timeZone: 'America/Bogota', 
            hour: '2-digit', 
            hour12: false 
        })
        const hourNum = parseInt(hora)
        const saludo = (hourNum >= 5 && hourNum < 12) ? 'Buenos días' : (hourNum >= 12 && hourNum < 18) ? 'Buenas tardes' : 'Buenas noches'

        // --- 3. SISTEMA DE CACHÉ (Evita lag en el servidor) ---
        // Cacheamos la estructura de los comandos por 60 segundos
        global.menuCache ??= { grouped: null, totalCmds: 0, lastUpdate: 0 }
        const ahoraMs = Date.now()

        if (!global.menuCache.grouped || (ahoraMs - global.menuCache.lastUpdate) > 60000) {
            const grouped = {}
            const totalCommandSet = new Set()

            // Loop optimizado: for...of es más rápido que forEach en V8
            for (const plugin of Object.values(global.plugins)) {
                if (!plugin || !plugin.command) continue
                
                const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
                const tags = plugin.tags || ['otros']

                for (const cmd of cmds) {
                    totalCommandSet.add(cmd)
                }

                for (const tag of tags) {
                    if (!grouped[tag]) grouped[tag] = new Set()
                    for (const cmd of cmds) {
                        grouped[tag].add(cmd)
                    }
                }
            }

            global.menuCache = {
                grouped,
                totalCmds: totalCommandSet.size,
                lastUpdate: ahoraMs
            }
        }

        const { grouped, totalCmds } = global.menuCache
        const totalUsers = Object.keys(global.db?.data?.users || {}).length

        // --- 4. CONSTRUCCIÓN DEL TEXTO ---
        let menuTexto = `𝐇𝐨𝐥𝐚 *${m.pushName}*, ${saludo}!
𝐒𝐨𝐲 *${nombreBot}* ${conn.user?.jid === global.conn?.user?.jid ? '(𝐌𝐨𝐨𝐝)' : '(𝐒𝐮𝐛-𝐁𝐨𝐭)'}

╭┈ ↷
│ ✐ ${global.textbot || 'Asistente Multi-funcional'}
│ ✐ ꒷ꕤ💎ദ Canal oficial ෴
│ https://whatsapp.com/channel/0029Vb6p68rF6smrH4Jeay3Y
╰─────────────────

ꙮ *Comandos:* ${totalCmds} únicos
ꙮ *Usuarios:* ${totalUsers} registrados

`
        // Secciones ordenadas
        const sortedTags = Object.keys(grouped).sort()
        for (const tag of sortedTags) {
            menuTexto += `*»  ⊹ ˚୨ •(=^●ω●^=)• ${tag.toUpperCase()}* ⊹\n`
            menuTexto += [...grouped[tag]].map(c => `> ❏ ${usedPrefix}${c}`).join('\n')
            menuTexto += '\n\n'
        }

        menuTexto += `_Powered by ${nombreBot}_`

        // --- 5. ENVÍO CON branding ---
        await conn.sendMessage(m.chat, {
            text: menuTexto.trim(),
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: `${nombreBot} | Stable v6.0`,
                    body: 'High Performance System 🚀',
                    mediaType: 1,
                    sourceUrl: 'https://github.com/zoredevteam-ctrl/Zore-two',
                    thumbnailUrl: bannerFinal,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })

    } catch (e) {
        console.error("Critical Error:", e)
        m.reply(`✘ Error interno: ${e.message}`)
    }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|ayuda|comandos)$/i

export default handler
