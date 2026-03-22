case 'kira':
case 'juicio': {
    const target = m.mentionedJid ? m.mentionedJid[0] : null;

    if (!target) {
        return reply('👁️ _𝕯𝖊𝖇𝖊𝖘 𝖈𝖔𝖓𝖔𝖈𝖊𝖗 𝖊𝖑 𝖗𝖔𝖘𝖙𝖗𝖔 𝖞 𝖊𝖑 𝖓𝖔𝖒𝖇𝖗𝖊._\n\nEtiqueta al criminal que deseas juzgar.');
    }

    if (target === sender) {
        return reply('📝 _𝕶𝖎𝖗𝖆 𝖓𝖔 𝖕𝖚𝖊𝖉𝖊 𝖏𝖚𝖟𝖌𝖆𝖗𝖘𝖊 𝖆 𝖘𝖎́ 𝖒𝖎𝖘𝖒𝖔..._');
    }

    // Historia narrativa con tipografía Gótica (Copia y pega tal cual)
    let kiraText = `🩸 *𝕰𝖑 𝖏𝖚𝖎𝖈𝖎𝖔 𝖍𝖆 𝖈𝖔𝖒𝖊𝖓𝖟𝖆𝖉𝖔* 🩸\n\n` +
                   `_Has estado observando a @${target.split('@')[0]}..._\n` +
                   `_Sus crímenes son imperdonables. Tienes la pluma en tu mano y la libreta abierta._\n\n` +
                   `¿𝕼𝖚𝖊́ 𝖉𝖊𝖘𝖙𝖎𝖓𝖔 𝖑𝖊 𝖊𝖘𝖕𝖊𝖗𝖆?`;

    // Estructura de botones interactivos (Baileys v6+)
    const interactiveMessage = {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: {
                    body: { text: kiraText },
                    footer: { text: 'Z0RT SYSTEMS ⚡ 𝕯𝖊𝖆𝖙𝖍 𝕹𝖔𝖙𝖊' },
                    header: { title: '📓 𝕰𝖑 𝕯𝖎𝖔𝖘 𝖉𝖊𝖑 𝕹𝖚𝖊𝖛𝖔 𝕸𝖚𝖓𝖉𝖔', hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": `{"display_text":"💔 Ataque al Corazón","id":"kira_ataque_${target}"}`
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": `{"display_text":"🚗 Accidente Trágico","id":"kira_accidente_${target}"}`
                            },
                            {
                                "name": "quick_reply",
                                "buttonParamsJson": `{"display_text":"🕊️ Perdonar Vida","id":"kira_perdonar_${target}"}`
                            }
                        ]
                    }
                }
            }
        }
    };

    // Enviamos el mensaje con la mención para que el @usuario se ilumine
    await conn.relayMessage(m.chat, interactiveMessage.viewOnceMessage.message, { messageId: m.key.id });
}
break;
