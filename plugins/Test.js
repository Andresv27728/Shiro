// Plugin: Repite / Repeat / Copiame
// Autor original: mantis-has
// Créditos: mantis-has (GitHub: https://github.com/mantis-has)

const commands = ['#repite', '#repeat', '#copiame'];

export async function before(m, { conn }) {
  if (!m.text) return;

  const lower = m.text.toLowerCase();
  const usedCommand = commands.find(cmd => lower.startsWith(cmd));
  if (!usedCommand) return;

  // Elimina el comando y espacios iniciales
  const content = m.text.slice(usedCommand.length).trim();
  if (!content) return;

  // Mensaje citado
  const quotedMsg = {
    key: { fromMe: false, participant: "0@s.whatsapp.net", remoteJid: m.chat, id: Math.random().toString(36).slice(2) },
    message: { conversation: 'MAKIMA BOT MD' }
  };

  await conn.sendMessage(m.chat, { text: content }, { quoted: quotedMsg });
}