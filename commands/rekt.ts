import { CommandInteraction, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class Twss implements Command {
    name = 'rekt';

    description = `get rekt`;

    strArgs: string[] = [];

    async executeCommand (message: Message): Promise<void> {
        DiscordUtils.sendChannelMessage(message, Utils.rekt[0], false);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        DiscordUtils.replyToInteraction(interaction, Utils.rekt[0]);
    }
}
