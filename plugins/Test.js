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
  // #soccer
  if (command === "soccer") {
    let user = global.db.data.users[m.sender];
    if (!user) user = global.db.data.users[m.sender] = {};
    if (user.lastSoccer && new Date - user.lastSoccer < SOC_CLAIM_TIMEOUT) {
      return await sendNewsletter(conn, m.chat, `「🩵」Debes esperar ${clockString(SOC_CLAIM_TIMEOUT - (new Date - user.lastSoccer))} para reclamar otro jugador de fútbol.`, m);
    }
    let jugador = jugadores[Math.floor(Math.random() * jugadores.length)];
    soccerStorage[m.chat] = {
      nombre: jugador.nombre,
      url: jugador.url,
      valor: jugador.valor,
      owner: null,
      msgId: null
    };
    let msg = await conn.sendMessage(m.chat, {
      image: { url: jugador.url },
      caption: `✰ Jugador: ${jugador.nombre}\n✰ Valor: ${jugador.valor}\n✰ Fuente: Deymoon\n✰ Bot: Makima 2.0`,
      contextInfo: newsletterContext([m.sender])
    }, { quoted: m });
    soccerStorage[m.chat].msgId = (await msg).key.id;
    user.lastSoccer = +new Date;
    return;
  }

  // #rcjugador (reclamar)
  if (command === "rcjugador") {
    let user = global.db.data.users[m.sender];
    if (!user) user = global.db.data.users[m.sender] = {};
    if (user.lastSoccer && new Date - user.lastSoccer < SOC_CLAIM_TIMEOUT) {
      return await sendNewsletter(conn, m.chat, `「🩵」Debes esperar ${clockString(SOC_CLAIM_TIMEOUT - (new Date - user.lastSoccer))} para reclamar otro jugador de fútbol.`, m);
    }
    if (!m.quoted || !m.quoted.id) return m.reply('Responde a la foto del jugador con #rcjugador para reclamarlo.');
    let soccer = soccerStorage[m.chat];
    if (!soccer || soccer.msgId !== m.quoted.id)
      return