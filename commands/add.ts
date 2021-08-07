import { CommandInteraction, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class Add implements Command {
    name = 'add';

    description = `adds a word to be used in an Acronym`;

    strArgs: string[] = [ 'word' ];

    dataUrl: string = process.env.WORDS_API_URL;

    async executeCommand (message: Message, args?: string[]): Promise<void> {
        const url = `${this.dataUrl}addWord?word=${encodeURIComponent(args[0])}`;
        const response = await Utils.postURLAuth(url);
        DiscordUtils.sendReply(message, response);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const url = `${this.dataUrl}addWord?word=${encodeURIComponent(interaction.options.getString('word'))}`;
        const response = await Utils.postURLAuth(url);
        DiscordUtils.replyToInteractionDeffered(interaction, response);
    }
}
