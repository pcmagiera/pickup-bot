import { Command } from '../core/types';
import Util from '../core/util';
import ServerModel from '../models/server';
import { Validator } from '../core/validator';
import BotModel from '../models/bot';
import GuildModel from '../models/guild';

const command: Command = {
    cmd: 'modify_bot',
    shortDesc: 'Modify server specific settings',
    desc: 'Modify server specific settings',
    args: [
        { name: '<key/show>', desc: 'Show current server settings or which property to modify', required: true },
        { name: '[value/none]', desc: 'The new value of the property, none to disable', required: false }
    ],
    global: true,
    perms: true,
    exec: async (bot, message, params) => {
        const key = params[0].toLowerCase();

        if (params.length > 1) {
            const value = params.slice(1).join(' ');
            const errors = await bot.getGuild(message.guild.id).modifyProperty({ key, value });

            if (errors.length) {
                return message.reply(errors[0].errorMessage);
            }

            message.reply(`successfully updated ${key} to ${value}`);
        } else {
            if (key !== 'show') {
                return message.reply('invalid argument given, do you mean show?');
            }

            const settings = bot.getGuild(message.guild.id);

            const globalExpireTime = settings.globalExpireTime ? Util.formatTime(settings.globalExpireTime) : 'disabled';
            const whitelistRole = settings.whitelistRole ? Util.getRole(message.guild, settings.whitelistRole.toString()) : null;
            const blacklistRole = settings.blacklistRole ? Util.getRole(message.guild, settings.blacklistRole.toString()) : null;
            const promotionRole = settings.promotionRole ? Util.getRole(message.guild, settings.promotionRole.toString()) : null;
            const defaultServer = settings.defaultServer ? await (await ServerModel.getServer(BigInt(message.guild.id), settings.defaultServer)).name : '-';
            const startMessage = settings.startMessage || '-';
            const subMessage = settings.subMessage || '-';
            const notifyMessage = settings.notifyMessage || '-';
            const warnStreaks = settings.warnStreaks;
            const warnsUntilBan = settings.warnsUntilBan;
            const warnStreakExpiration = Util.formatTime(settings.warnStreakExpiration);
            const warnExpirationTime = Util.formatTime(settings.warnExpiration);
            const warnBanTime = Util.formatTime(settings.warnBanTime);
            const warnBanTimeMultiplier = settings.warnBanTimeMultiplier;


            const infoString =
                `**__Server configuration__**\n` +
                `Prefix: **${settings.prefix}**\n` +
                `Global expire: **${globalExpireTime}**\n` +
                `Default promotion: **${promotionRole ? promotionRole.name : '-'}**\n` +
                `Default whitelist: **${whitelistRole ? whitelistRole.name : '-'}**\n` +
                `Default blacklist: **${blacklistRole ? blacklistRole.name : '-'}**\n` +
                `Default Server: **${defaultServer}**\n` +
                `Start message: **${startMessage}**\n` +
                `Sub message: **${subMessage}**\n` +
                `Notify message: **${notifyMessage}**\n` +
                `Max warn streaks: **${warnStreaks}**\n` +
                `Warns until ban: **${warnsUntilBan}**\n` +
                `Warn streak expiration: **${warnStreakExpiration}**\n` +
                `Warn expiration time: **${warnExpirationTime}**\n` +
                `Warn bantime: **${warnBanTime}**\n` +
                `Warn bantime multiplier: **${warnBanTimeMultiplier}**\n`;

            message.channel.send(infoString);
        }
    }
}

module.exports = command;