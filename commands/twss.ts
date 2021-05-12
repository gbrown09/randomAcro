import { CommandInteraction, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class Twss implements Command {
    name = 'twss';

    description = `good ol twss gifs`;

    strArgs: string[] = [];

    async executeCommand (message: Message): Promise<void> {
        const index = Math.floor(Math.random() * 4);
        DiscordUtils.sendChannelMessage(message, Utils.twss[index]);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const index = Math.floor(Math.random() * 4);
        DiscordUtils.replyToInteraction(interaction, Utils.twss[index]);
    }
}
