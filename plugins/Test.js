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
  // ... [Todos los comandos anteriores igual, como #soccer, #rcjugador, #jugadores, #rgjugador, #vtjugador, #vrjugador] ...

  // #vrjugador (proponer venta)
  if (command === "vrjugador") {
    let user = global.db.data.users[m.sender];
    if (!user || !user.soccerPlayers || user.soccerPlayers.length === 0)
      return await sendNewsletter(conn, m.chat, `「🩵」No tienes jugadores para vender.`, m);

    let mention = m.mentionedJid && m.mentionedJid[0];
    let partes = args.filter(a => !a.startsWith("@"));
    let jugadorNombre = partes.slice(0, -1).join(' ').trim();
    let cantidad = parseInt(partes[partes.length - 1]);

    if (!jugadorNombre) return await sendNewsletter(conn, m.chat, `「🩵」Debes`, m);
    if (!mention) return await sendNewsletter(conn, m.chat, `「🩵」Debes mensionar un usuario para vender este jugador.`, m);
    if (isNaN(cantidad)) return await sendNewsletter(conn, m.chat, `「🩵」Debes poner la cantidad de XP que deseas por el jugador (ejemplo: #vrjugador @usuario Messi 200).`, m);
    if (cantidad < 1 || cantidad > 1000) return await sendNewsletter(conn, m.chat, `「🩵」El Jugador debe ser vendido de 1 a 1000 de XP.`, m);

    let idx = user.soccerPlayers.findIndex(j => j.toLowerCase() === jugadorNombre.toLowerCase());
    if (idx === -1) return await sendNewsletter(conn, m.chat, `「🩵」Este personaje no está reclamado por ti. Usa #soccer para reclamar un personaje.`, m);

    let ventaId = `${m.chat}-${Date.now()}`;
    ventasPendientes[ventaId] = {
      vendedor: m.sender,
      comprador: mention,
      jugador: user.soccerPlayers[idx],
      precio: cantidad,
      msgId: null
    };

    let compradorTag = '@' + mention.split('@')[0];
    let vendedorTag = '@' + m.sender.split('@')[0];

    let texto = `「🩵」${compradorTag} el usuario ${vendedorTag} te quiere vender el jugador ${user.soccerPlayers[idx]} por ${cantidad} de XP\n\nResponde a este mensaje con:\n• #comprar\n• #dejar`;

    let ventaMsg = await conn.sendMessage(m.chat, {
      text: texto,
      mentions: [mention, m.sender],
      contextInfo: newsletterContext([mention, m.sender])
    }, { quoted: m });

    ventasPendientes[ventaId].msgId = ventaMsg.key.id;
    return;
  }

  // #comprar (aceptar venta)
  if (command === "comprar" && m.quoted && m.quoted.id) {
    for (let ventaId in ventasPendientes) {
      let venta = ventasPendientes[ventaId];
      if (venta.msgId === m.quoted.id) {
        if (m.sender !== venta.comprador && m.sender !== venta.vendedor)
          return await sendNewsletter(conn, m.chat, `「🩵」La venta no es contigo, no te metas Gay.`, m);

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
    }
  }

  // #dejar (rechazar venta)
  if (command === "dejar" && m.quoted && m.quoted.id)ientes[ventaId];
      if (venta.msgId === m.quoted.id) {
        if (m.sender !== venta.comprador && m.sender !== venta.vendedor)
          return await sendNewsletter(conn, m.chat, `「🩵」La venta no es contigo, no te metas Gay.`, m);

        if (m.sender !== venta.comprador)
          return await sendNewsletter(conn, m.chat, `「🩵」Solo el usuario al que le venden puede rechazar.`, m);

        await sendNewsletter(conn, m.chat, `「🩵」Venta cancelada.`, m);
        delete ventasPendientes[ventaId];
        return;
      }
    }
  }

  // Mensaje inválido respondiendo a venta
  if (m.quoted && m.quoted.id) {
    for (let ventaId in ventasPendientes) {
      let venta = ventasPendientes[ventaId];
      if (venta.msgId === m.quoted.id) {
        if (m.sender !== venta.comprador && m.sender !== venta.vendedor)
          return await sendNewsletter(conn, m.chat, `「🩵」La venta no es contigo, no te metas Gay.`, m);

        // Si el mensaje es otro comando/texto que no sea #comprar o #dejar
        if (command !== "comprar" && command !== "dejar") {
          return await sendNewsletter(conn, m.chat, `「🩵」El mensaje "${m.text}" no está en la propuesta del bot. Responde con #comprar o #dejar.`, m);
        }
      }
    }
  }
};

// ... [Resto del archivo igual: handler.help, handler.tags, handler.command, export, sendNewsletter, newsletterContext, clockString] ...