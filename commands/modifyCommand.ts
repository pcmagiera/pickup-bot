import { Command } from '../core/types';
import { Validator } from '../core/validator';

const command: Command = {
    cmd: 'modify_command',
    category: 'admin',
    aliases: ['modify_cmd'],
    shortDesc: 'Disable/enable or modify commands',
    desc: 'Disable/enable or modify commands',
    args: [
        { name: '<command>', desc: 'The command to disable/enable or modify', required: true },
        { name: '<operation>', desc: 'Operation on the command, can be show, enable, disable or the property', required: true },
        { name: '[value]', desc: 'The new value of the default', required: false }
    ],
    global: true,
    perms: true,
    exec: async (bot, message, params) => {
        let command = params[0].toLowerCase();
        const operation = params[1];

        if (!bot.doesCommandExist(command)) {
            return message.reply(`unknown command ${command}`);
        }

        const guildSettings = bot.getGuild(message.guild.id);
        command = bot.getCommand(command);

        if (params.length === 2) {
            if (!['show', 'enable', 'disable'].includes(operation)) {
                return message.reply('unknown operation do you mean show, enable or disable?');
            }

            if (operation === 'disable') {
                if (['modify_command', 'permission', 'pickup'].includes(command.cmd)) {
                    return message.reply('you can\'t disable this command');
                }

                if (guildSettings.disabledCommands.includes(command.cmd)) {
                    return message.reply(`command ${command.cmd} is already disabled`);
                }

                guildSettings.disableCommand(command.cmd);
                return message.reply(`disabled command ${command.cmd}`);
            }

            if (operation === 'enable') {
                if (!guildSettings.disabledCommands.includes(command.cmd)) {
                    return message.reply(`command ${command.cmd} is not disabled`);
                }

                guildSettings.enableCommand(command.cmd);
                return message.reply(`enabled command ${command.cmd}`);
            }

            if (operation === 'show') {
                if (command.defaults) {
                    let info;

                    if (guildSettings.commandSettings.has(command.cmd)) {
                        const settings = guildSettings.commandSettings.get(command.cmd);
                        info = settings.map((value, index) => `${command.defaults[index].name}: ${value}`).join('\n');
                    } else {
                        info = command.defaults.map(def => `${def.name}: ${def.value}\n`);
                    }

                    message.channel.send(`Settings of ${command.cmd}\n${info}`);
                } else {
                    message.reply(`command ${command.cmd} got no settings`);
                }
            }
        } else {
            const value = params[2];

            if (command.defaults) {
                if (!command.defaults.map(def => def.name).includes(operation)) {
                    return message.reply(`unknown setting, did you mean ${command.defaults.map(def => def.name).join(', ')}?`);
                }

                const isInvalid = Validator.CommandOption.validate(guildSettings, { command, key: operation, value });

                if (isInvalid.length) {
                    return message.reply(isInvalid[0].errorMessage);
                }

                let currentSettings;

                if (guildSettings.commandSettings.has(command.cmd)) {
                    currentSettings = guildSettings.commandSettings.get(command.cmd);
                } else {
                    currentSettings = command.defaults.map(def => def.value);
                }

                const index = command.defaults.findIndex(def => def.name === operation);
                const isNumeric = command.defaults[index].type === 'number';

                if (currentSettings[index].toString() === value) {
                    return message.reply(`property ${operation} of command ${command.cmd} is already set to this value`);
                }

                currentSettings[index] = isNumeric ? +value : value;

                await guildSettings.modifyCommand(command, currentSettings);
                message.reply(`successfully modified command ${command.cmd}, set ${operation} to ${value}`);
            } else {
                message.reply('this command got no configurable settings');
            }
        }
    }
}

module.exports = command;