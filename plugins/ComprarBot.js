const handler = async (m, {conn}) => {
  m.reply(global.ComprarBot);
};
handler.command ='comprarbot',/^(ComprarBot|Comprar|comprar|ComprarBot)$/i;
export default handler;

global.ComprarBot = `
〔 *MAKIMA - BOT* 〕

*BOT PARA GRUPO* :
> wa.me/18293142989

*BOT PERZONALIZADO* :
> wa.me/18293142989
`;