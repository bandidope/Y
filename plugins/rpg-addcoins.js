let handler = async (m, { conn, args, prefix, command, db }) => {
    try {
        // 1) Determinar destinatario: preferimos mentionedJid, luego quoted, luego token @user o número en args[0]
        let who = null

        if (m.mentionedJid && m.mentionedJid.length) {
            who = m.mentionedJid[0]
        } else if (m.quoted && m.quoted.sender) {
            who = m.quoted.sender
        } else {
            // buscar un token tipo @123456789 o 123456789 en args
            const a = args.find(x => !!x)
            if (a) {
                // si empieza con @, quitar @ y añadir dominio si falta
                let candidate = a.replace(/^@/, '')
                // si ya es un JID completo
                if (/@/.test(candidate)) who = candidate
                else if (/^\d{5,20}$/.test(candidate)) who = candidate + '@s.whatsapp.net'
            }
        }

        if (!who) return m.reply(`*⚠️ ¿A quién quieres darle monedas?*\n\nEjemplo:\n*${prefix + command} @user 500*`)

        // 2) Extraer cantidad de forma segura (buscar primer token que contenga número)
        const parseAmount = (s) => {
            if (!s) return NaN
            // quitar comas y puntos de miles, permitir signo negativo pero no lo aceptaremos luego
            const cleaned = String(s).replace(/[^\d\-]/g, '')
            if (cleaned === '' || cleaned === '-' ) return NaN
            return parseInt(cleaned)
        }

        // buscamos en todos los args (excepto el que es el mention si lo pusieron como primer arg)
        let amountArg = null
        for (let i = 0; i < args.length; i++) {
            const a = args[i]
            // si el arg contiene '@' muy probablemente sea el usuario; lo saltamos
            if (!a) continue
            if (a.includes('@')) continue
            const n = parseAmount(a)
            if (!isNaN(n)) { amountArg = a; break }
        }

        const count = parseAmount(amountArg)

        if (!amountArg || isNaN(count)) {
            return m.reply(`*🔢 Por favor, ingresa una cantidad válida.*\nEjemplo: *${prefix + command} @${who.split('@')[0]} 1000*`, null, { mentions: [who] })
        }

        if (count <= 0) return m.reply('*❌ La cantidad debe ser mayor que 0.*', null, { mentions: [who] })
        if (count > 1e12) return m.reply('*❌ La cantidad es demasiado grande.*', null, { mentions: [who] })

        // 3) Localizar/crear la estructura de usuarios en la base de datos (compatibilidad con distintos bots)
        // preferimos usar el db que te pasaron, pero soportamos global.db.data.users si existe
        let usersRef = null
        let usersIsDbPassed = false

        if (db && typeof db === 'object' && db.users) {
            usersRef = db.users
            usersIsDbPassed = true
        } else if (global.db && global.db.data && global.db.data.users) {
            usersRef = global.db.data.users
        } else if (db && db.data && db.data.users) {
            usersRef = db.data.users
            usersIsDbPassed = true
        } else {
            // fallback: crear db.users en el objeto db si existe, sino en global.db.data.users
            if (db && typeof db === 'object') {
                db.users = {}
                usersRef = db.users
                usersIsDbPassed = true
            } else {
                global.db = global.db || { data: { users: {} } }
                global.db.data = global.db.data || {}
                global.db.data.users = global.db.data.users || {}
                usersRef = global.db.data.users
            }
        }

        // 4) Inicializar usuario receptor
        if (!usersRef[who]) {
            usersRef[who] = { coin: 0, exp: 0, limit: 20, name: await conn.getName(who) }
        } else if (usersRef[who].coin === undefined) {
            usersRef[who].coin = 0
        }

        // 5) Sumar y guardar
        usersRef[who].coin = Number(usersRef[who].coin) + Number(count)

        // Intentar guardar la DB según la API que tenga el bot (variantes comunes)
        try {
            if (global.db && typeof global.db.write === 'function') {
                await global.db.write()
            } else if (global.db && typeof global.db.save === 'function') {
                await global.db.save()
            } else if (global.database && typeof global.database.save === 'function') {
                await global.database.save()
            } else if (typeof save === 'function') {
                // algunos proyectos exponen un save global
                await save()
            } else if (usersIsDbPassed && typeof db.write === 'function') {
                await db.write()
            }
            // si no hay método de guardado, no hacemos nada: hemos actualizado el objeto en memoria
        } catch (e) {
            // no rompemos por error de guardado; lo notificamos en consola
            console.error('Error saving DB in addcoins handler:', e)
        }

        const name = await conn.getName(who)
        return m.reply(`*✅ ECONOMÍA ACTUALIZADA*\n\n*👤 Usuario:* ${name}\n*💰 Añadido:* ${count} Coins\n*👛 Total:* ${usersRef[who].coin} Coins`, null, { mentions: [who] })

    } catch (err) {
        console.error(err)
        return m.reply('*❌ Ocurrió un error inesperado.*')
    }
}

handler.help = ['addcoins']
handler.tags = ['owner']
handler.command = ['addcoins', 'añadircoins', 'darcoins']
handler.owner = true

export default handler