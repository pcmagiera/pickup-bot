import { Command } from '../core/types';
import PickupModel from '../models/pickup';
import ServerModel from '../models/server';

const command: Command = {
    cmd: 'ip',
    category: 'info',
    shortDesc: 'Displays the IP & Password for a given pickup if set',
    desc: 'Displays the IP & Password for a given pickup if set',
    args: [
        { name: '<pickup>', desc: 'Pickup to get the server from', required: true }
    ],
    global: true,
    perms: false,
    exec: async (bot, message, params) => {
        const pickupName = params[0].toLowerCase();

        if (!await (await PickupModel.areValidPickups(BigInt(message.guild.id), pickupName)).length) {
            return message.reply('given pickup not found');
        }

        const pickupSettings = await PickupModel.getPickupSettings(BigInt(message.guild.id), pickupName);

        // Go for default guild server
        if (!pickupSettings.serverId) {
            const guildSettings = bot.getGuild(message.guild.id);

            if (!guildSettings.defaultServer) {
                return message.reply(`no server set for ${pickupName}`);
            }

            const server = await ServerModel.getServer(BigInt(message.guild.id), guildSettings.defaultServer);

            return message.channel.send(`${server.name} server - IP: ${server.ip}${server.password ? ` Password: ${server.password}` : ''}`);
        } else {
            const server = await ServerModel.getServer(BigInt(message.guild.id), pickupSettings.serverId);

            message.channel.send(`${server.name} server - IP: ${server.ip}${server.password ? ` Password: ${server.password}` : ''}`);
        }
    }
}

module.exports = command;