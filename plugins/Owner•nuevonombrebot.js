/*
Código creado por Félix Manuel - Makima Bot MD
Respeta los créditos
*/

const memes = [
  { url: "https://files.catbox.moe/1abcde.jpg", fuente: "TikTok" },
  { url: "https://files.catbox.moe/2abcde.jpg", fuente: "Facebook" },
  { url: "https://files.catbox.moe/3abcde.jpg", fuente: "Instagram" },
  { url: "https://files.catbox.moe/4abcde.jpg", fuente: "Twitter" },
  { url: "https://files.catbox.moe/5abcde.jpg", fuente: "Reddit" }
];

const channelRD = { id: "120363400360651198@newsletter", name: "DEYMOON CLUB - MEMES" };
const MAKIMA_ICON = "https://files.catbox.moe/mqtxvp.jpg";
const GITHUB_MAKIMA = "https://github.com/mantis-has/Makima";
const NEWSLETTER_TITLE = '🩵 DEYMOON CLUB 🩵';

let handler = async (m, { conn, command }) => {
  if (command === 'memechannel') {
    let selectedMemes = [];
    for (let i = 0; i < 3; i++) {
      selectedMemes.push(memes[Math.floor(Math.random() * memes.length)]);
    }

    for (let meme of selectedMemes) {
      await conn.sendMessage(m.chat, {
        image: { url: meme.url },
        caption: `> Meme Destacado\n\nFuente: ${meme.fuente}\nAutor: Deymoon Club`,
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
            body: "Memes de calidad",
            thumbnailUrl: MAKIMA_ICON,
            sourceUrl: GITHUB_MAKIMA,
            mediaType: 1,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    }
  }
};

handler.help = ['memechannel'];
handler.tags = ['fun'];
handler.command = ['memechannel'];
handler.register = true;
export default handler;