import { CommandInteraction, Message } from 'discord.js';
import Axios from 'axios';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';

export default class AddBday implements Command {
    name = 'deletebday';

    description = 'delete your bday cause you like secrets"';

    strArgs: string[] = [];

    async executeCommand (message: Message): Promise<void> {
        const { id } = message.author;
        try {
            await Axios.delete(`http://localhost:3000/bday/delete?id=${id}`);
            DiscordUtils.sendReply(message, `Your bday has been deleted, guess you hate celebrations`);
        } catch(e) {
            DiscordUtils.sendReply(message, `I don't have your bday`);
        }
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const { id } = interaction.user;
        try {
            await Axios.delete(`http://localhost:3000/bday/delete?id=${id}`);
            DiscordUtils.replyToInteraction(interaction, `Your bday has been deleted, guess you hate celebrations`);
        } catch(e) {
            DiscordUtils.replyToInteraction(interaction, `I don't have your bday`);
        }
    }
}
