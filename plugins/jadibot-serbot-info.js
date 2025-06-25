// Adaptado por mantis-has (github.com/mantis-has) para sistema Makima MD

async function handler(m, { conn: stars }) {
  let uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws && conn.ws.socket && conn.ws.socket.readyState === 1) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  // Clasificación de bots (adapta a tu sistema si tienes otra forma de distinguirlos)
  let users = [...uniqueUsers.values()]
  let principales = users.filter(v => v.user?.isMain) // Ajusta esta condición si tienes flag para "principal"
  let prembots = users.filter(v => v.user?.isPremium) // Ajusta esta condición si tienes flag para "premium"
  let subbots = users.filter(v => !v.user?.isMain && !v.user?.isPremium)

  // En este grupo: saca todos los bots que estén en el grupo actual
  let groupParticipants = (await stars.groupMetadata(m.chat).catch(() => ({}))).participants || []
  let botsEnGrupo = users.filter(v => groupParticipants.some(p => p.id === v.user?.jid))
  let listaBotsGrupo = botsEnGrupo.map(v => {
    let nombre = v.user?.name || "SubBot"
    let tipo = v.user?.isMain
      ? "Bot Oficial"
      : v.user?.isPremium
      ? "Prem-Bot"
      : "SubBot"
    return `• ${nombre} (${tipo})`
  }).join('\n') || 'En este grupo no hay Bots activos'

  let responseMessage = `╭━━━〔 LISTA DE BOTS ACTIVOS 〕━━━╮

principales: ${principales.length}
Prem-Bots: ${prembots.length}
Subbots: ${subbots.length}

En este grupo:
${listaBotsGrupo}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`

  const imageUrl = 'https://qu.ax/dXOUo.jpg' // Cambia si quieres otra miniatura

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        displayName: "Subbot",
        vcard: "BEGIN:VCARD\nVERSION:3.0\nN:;Subbot;;;\nFN:Subbot\nEND:VCARD"
      }
    }
  }

  await stars.sendMessage(m.chat, {
    image: { url: imageUrl },
    caption: responseMessage
  }, { quoted: fkontak })
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['jadibot']

export default handler