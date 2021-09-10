import { CommandInteraction, Message } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';

export default class AddBday implements Command {
    name = 'addbday';

    description = 'add your birthday so I know';

    strArgs: string[] = [ 'date <mm/dd>' ];

    async executeCommand (message: Message, args?: string[]): Promise<void> {
        const r = new RegExp('(0\\d{1}|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])');
        if (r.test(args[0]) !== true)
            DiscordUtils.sendReply(message, 'Try an actual month dummy, the format is mm/dd pls');
        else
            DiscordUtils.sendReply(message, await BdayService.addBday(message.author.id, args[0]));
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const r = new RegExp('(0\\d{1}|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])');
        const input = interaction.options.getString('date');
        if (r.test(input) !== true)
            DiscordUtils.replyToInteraction(interaction, 'Try an actual month dummy, the format is mm/dd pls');
        else
            DiscordUtils.replyToInteraction(interaction, await BdayService.addBday(interaction.user.id, input));
    }
}
