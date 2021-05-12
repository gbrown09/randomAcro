import { CommandInteraction, Message } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class EightBall implements Command {
    name = '8ball';

    description = 'answers a simple question';

    strArgs: string[] = [ 'question' ];

    async executeCommand (message: Message): Promise<void> {
        const index = Math.floor(Math.random() * 13);
        DiscordUtils.sendReply(message, Utils.eightBall[index]);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const index = Math.floor(Math.random() * 13);
        const reply = `You asked: ${interaction.options[0].value}\nThe answer is: `;
        DiscordUtils.replyToInteraction(interaction, reply+Utils.eightBall[index]);
    }
}
