import Discord from 'discord.js';
import Bot from '../bot';

module.exports = async (bot: Bot, guild: Discord.Guild) => {
    bot.removeGuild(guild.id);
}