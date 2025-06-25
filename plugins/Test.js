let handler = m => m;
handler.before = async function (m, { conn }) {
  if (!m.messageStubType || !m.isGroup) return;

  // 29 = promote, 30 = demote (según Baileys)
  if (m.messageStubType == 29 || m.messageStubType == 30) {
    // Nombre o número limpio del usuario afectado
    let target = m.messageStubParameters[0];
    let username = '';
    try {
      username = await conn.getName(target);
    } catch (e) {}
    if (!username || username === target) {
      username = target.replace(/[@:\.a-z]/gi, '');
    }

    // Nombre o número limpio del actor
    let by = m.sender;
    let username2 = '';
    try {
      username2 = await conn.getName(by);
    } catch (e) {}
    if (!username2 || username2 === by) {
      username2 = by.replace(/[@:\.a-z]/gi, '');
    }

    let texto = '';
    if (m.messageStubType == 29) {
      texto = `${username} fue puesto de admin por ${username2}`;
    } else if (m.messageStubType == 30) {
      texto = `${username} fue quitado de admin por ${username2}`;
    }

    await conn.sendMessage(m.chat, { text: texto });
  }
};
export default handler;