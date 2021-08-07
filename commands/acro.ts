import { CommandInteraction, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class Acro implements Command {
    name = 'acro';

    description = `gets you the acro you're looking for`;

    strArgs: string[] = [ 'acronym' ];

    dataUrl: string = process.env.WORDS_API_URL;

    async executeCommand (message: Message, args?: string[]): Promise<void> {
        const url = `${this.dataUrl}randomGet?acronym=${encodeURIComponent(args[0])}`;
        const response = await Utils.getURLAuth(url);
        DiscordUtils.sendReply(message, response);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const url = `${this.dataUrl}randomGet?acronym=${encodeURIComponent(interaction.options.getString('acronym'))}`;
        const response = await Utils.getURLAuth(url);
        DiscordUtils.replyToInteractionDeffered(interaction, response);
    }
}
