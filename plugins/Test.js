/*
Código creado por Félix Manuel - Makima Bot MD
Respeta los créditos
*/

const jugadores = [
  { nombre: "Cristiano Ronaldo", valor: 100, url: "https://files.catbox.moe/fl7ibk.jpg" },
  { nombre: "Luka Modric", valor: 100, url: "https://files.catbox.moe/606f25.jpg" },
  { nombre: "Kevin Benzema", valor: 100, url: "https://qu.ax/JlOOv.jpg" },
  { nombre: "Lamine Yamal", valor: 100, url: "https://qu.ax/KPZrj.jpg" },
  { nombre: "Lionel Messi", valor: 100, url: "https://qu.ax/ggRkD.jpg" },
  { nombre: "Keylan Mbappe", valor: 100, url: "https://qu.ax/XPEDZ.jpg" },
  { nombre: "Bellingang", valor: 100, url: "https://qu.ax/krNHY.jpg" },
  { nombre: "Vinicios JR", valor: 100, url: "https://qu.ax/QHNhz.jpg" },
  { nombre: "Ronaldo", valor: 100, url: "https://qu.ax/jDVGs.jpg" }
];

const channelRD = { id: "120363400360651198@newsletter", name: "MAKIMA - FRASES" };
const MAKIMA_ICON = "https://telegra.ph/file/2e232d8e5b9e8c7b3e4a2.jpg";
const GITHUB_MAKIMA = "https://github.com/mantis-has/Makima";
const NEWSLETTER_TITLE = '🩵 MAKIMA BOT MD 🩵';
const SOC_CLAIM_TIMEOUT = 3 * 60 * 1000; // 3 minutos

let soccerStorage = global.db.data.soccer || (global.db.data.soccer = {});
let ventasPendientes = global.db.data.ventasPendientes || (global.db.data.ventasPendientes = {});

let handler = async (m, { conn, command, args }) => {

  // ... otros comandos anteriores (soccer, rcjugador, jugadores, rgjugador, vtjugador) ...

  // #vrjugador (proponer venta)
  if (command === "vrjugador") {
    let user = global.db.data.users[m.sender];
    if (!user || !user.soccerPlayers || user.soccerPlayers.length === 0)
      return await sendNewsletter(conn, m.chat, `「🩵」No tienes jugadores para vender.`, m);

    let mention = m.mentionedJid && m.mentionedJid[0];
    let partes = args.filter(a => !a.startsWith("@"));
    let jugadorNombre = partes.slice(0, -1).join(' ').trim();
    let cantidad = parseInt(partes[partes.length - 1]);

    if (!jugadorNombre) return await sendNewsletter(conn, m.chat, `「🩵」Debes especificar el nombre del jugador que deseas vender.`, m);
    if (!mention) return await sendNewsletter(conn, m.chat, `「🩵」Debes mencionar un usuario para vender este jugador.`, m);
    if (isNaN(cantidad)) return await sendNewsletter(conn, m.chat, `「🩵」Debes poner la cantidad de XP que deseas por el jugador (ejemplo: #vrjugador @usuario Messi 200).`, m);
    if (cantidad < 1 || cantidad > 1000) return await sendNewsletter(conn, m.chat, `「🩵」El Jugador debe ser vendido de 1 a 1000 de XP.`, m);

    let idx = user.soccerPlayers.findIndex(j => j.toLowerCase() === jugadorNombre.toLowerCase());
    if (idx === -1) return await sendNewsletter(conn, m.chat, `「🩵」Este personaje no está reclamado por ti. Usa #soccer para reclamar un personaje.`, m);

    // Evitar ventas pendientes duplicadas con el comprador
    for (let id in ventasPendientes) {
      let venta = ventasPendientes[id];
      if (venta.comprador === mention && venta.chat === m.chat) {
        return await sendNewsletter(conn, m.chat, `「🩵」Este usuario ya tiene una venta pendiente.`, m);
      }
    }

    let ventaId = `${m.chat}-${mention}`;
    ventasPendientes[ventaId] = {
      vendedor: m.sender,
      comprador: mention,
      jugador: user.soccerPlayers[idx],
      precio: cantidad,
      chat: m.chat
    };

    let compradorTag = '@' + mention.split('@')[0];
    let vendedorTag = '@' + m.sender.split('@')[0];

    let texto = `「🩵」${compradorTag} el usuario ${vendedorTag} te quiere vender el jugador ${user.soccerPlayers[idx]} por ${cantidad} de XP\n\nUsa #comprar para aceptar o #rechazar para cancelar.`;

    await conn.sendMessage(m.chat, {
      text: texto,
      mentions: [mention, m.sender],
      contextInfo: newsletterContext([mention, m.sender])
    }, { quoted: m });

    return;
  }

  // #comprar (aceptar venta)
  if (command === "comprar") {
    let ventaId = `${m.chat}-${m.sender}`;
    let venta = ventasPendientes[ventaId];
    if (!venta)
      return await sendNewsletter(conn, m.chat, `「🩵」No tienes ninguna venta pendiente para aceptar.`, m);

    if (m.sender !== venta.comprador)
      return await sendNewsletter(conn, m.chat, `「🩵」Solo el usuario al que le venden puede aceptar.`, m);

    let comprador = global.db.data.users[venta.comprador];
    if (!comprador || typeof comprador.exp !== 'number' || comprador.exp < venta.precio)
      return await sendNewsletter(conn, m.chat, `「🩵」No tienes suficiente XP para comprar este jugador.`, m);

    let vendedor = global.db.data.users[venta.vendedor];
    if (!vendedor) vendedor = global.db.data.users[venta.vendedor] = {};
    if (!comprador.soccerPlayers) comprador.soccerPlayers = [];
    if (!vendedor.soccerPlayers) vendedor.soccerPlayers = [];

    let idx = vendedor.soccerPlayers.findIndex(j => j.toLowerCase() === venta.jugador.toLowerCase());
    if (idx === -1)
      return await sendNewsletter(conn, m.chat, `「🩵」El vendedor ya no tiene ese jugador.`, m);

    comprador.exp -= venta.precio;
    vendedor.exp = (typeof vendedor.exp === 'number' ? vendedor.exp : 0) + venta.precio;
    comprador.soccerPlayers.push(venta.jugador);
    vendedor.soccerPlayers.splice(idx, 1);

    let compradorTag = '@' + venta.comprador.split('@')[0];
    let vendedorTag = '@' + venta.vendedor.split('@')[0];

    await sendNewsletter(conn, m.chat, `「🩵」${compradorTag} ha aceptado la compra de ${venta.jugador} por ${venta.precio} de XP.`, m);
    delete ventasPendientes[ventaId];
    return;
  }

  // #rechazar (rechazar venta)
  if (command === "rechazar") {
    let ventaId = `${m.chat}-${m.sender}`;
    let venta = ventasPendientes[ventaId];
    if (!venta)
      return await sendNewsletter(conn, m.chat, `「🩵」No tienes ninguna venta pendiente para rechazar.`, m);

    if (m.sender !== venta.comprador)
      return await sendNewsletter(conn, m.chat, `「🩵」Solo el usuario al que le venden puede rechazar.`, m);

    await sendNewsletter(conn, m.chat, `「🩵」Venta cancelada.`, m);
    delete ventasPendientes[ventaId];
    return;
  }
};

handler.help = ['soccer', 'rcjugador', 'jugadores', 'rgjugador', 'vtjugador', 'vrjugador', 'comprar', 'rechazar'];
handler.tags = ['games'];
handler.command = ['soccer', 'rcjugador', 'jugadores', 'rgjugador', 'vtjugador', 'vrjugador', 'comprar', 'rechazar'];
handler.register = true;
export default handler;

async function sendNewsletter(conn, chat, text, quoted = null) {
  await conn.sendMessage(chat, {
    text,
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        newsletterName: channelRD.name,
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: NEWSLETTER_TITLE,
        body: channelRD.name,
        thumbnailUrl: MAKIMA_ICON,
        sourceUrl: GITHUB_MAKIMA,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }, { quoted });
}

function newsletterContext(mentioned = []) {
  return {
    mentionedJid: mentioned,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: channelRD.id,
      newsletterName: channelRD.name,
      serverMessageId: -1,
    },
    forwardingScore: 999,
    externalAdReply: {
      title: NEWSLETTER_TITLE,
      body: channelRD.name,
      thumbnailUrl: MAKIMA_ICON,
      sourceUrl: GITHUB_MAKIMA,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  };
}

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}