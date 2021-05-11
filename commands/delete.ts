import { CommandInteraction, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class Delete implements Command {
    name = 'delete';

    description = `deletes a word from the list`;

    strArgs: string[] = [ 'word' ];

    dataUrl: string = process.env.WORDS_API_URL;

    async executeCommand (message: Message, args?: string[]): Promise<void> {
        const url = `${this.dataUrl}deleteWord?word=${encodeURIComponent(args[0])}`;
        const response = await Utils.postURLAuth(url);
        DiscordUtils.sendReply(message, response);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const url = `${this.dataUrl}deleteWord?word=${encodeURIComponent(interaction.options[0].value)}`;
        const response = await Utils.postURLAuth(url);
        DiscordUtils.replyToInteractionDeffered(interaction, response);
    }
}
