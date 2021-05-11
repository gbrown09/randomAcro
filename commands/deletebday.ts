import { CommandInteraction, Message } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';

export default class AddBday implements Command {
    name = 'deletebday';

    description = 'delete your bday cause you like secrets"';

    strArgs: string[] = [];

    async executeCommand (message: Message): Promise<void> {
        const { id } = message.author;
        if (Object.prototype.hasOwnProperty.call(BdayService.bdays, id)) {
            delete BdayService.bdays[id];
            BdayService.writeBdays();
            DiscordUtils.sendReply(message, `Your bday has been deleted, guess you hate celebrations`);
        } else {
            DiscordUtils.sendReply(message, `I don't have your bday`);
        }
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const { id } = interaction.user;
        if (Object.prototype.hasOwnProperty.call(BdayService.bdays, id)) {
            delete BdayService.bdays[id];
            BdayService.writeBdays();
            DiscordUtils.replyToInteraction(interaction, `Your bday has been deleted, guess you hate celebrations`);
        } else {
            DiscordUtils.replyToInteraction(interaction, `I don't have your bday`);
        }
    }
}
