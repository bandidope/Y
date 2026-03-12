let handler = async (m, { conn }) => {
    // Intentamos buscar el ID en un mensaje reenviado de un canal
    let jid = m.quoted?.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid 
           || m.msg?.contextInfo?.forwardedNewsletterMessageInfo?.newsletterJid;

    if (!jid) {
        // Si no lo encuentra, vamos a mostrarte qué información está recibiendo el bot
        console.log("DEBUG INFO:", JSON.stringify(m.quoted || m, null, 2));
        return m.reply("💔 *No detecto el ID del canal.*\n\n👉 **Haz esto:**\n1. Ve a tu canal.\n2. Reenvía un mensaje del canal al chat del bot.\n3. Responde a ese mensaje reenviado con el comando `#idcanal`.");
    }

    await m.reply(`✅ *ID ENCONTRADO:*\n\n\`${jid}\`\n\nCopia esto y ponlo en tu código darling~`);
}

handler.help = ['idcanal']
handler.tags = ['owner']
handler.command = ['idcanal', 'getid']
handler.owner = true

export default handler
