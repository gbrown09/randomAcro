import { Client, CommandInteraction, Message } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';

export default class NextBday implements Command {
    name = 'nextbday';

    description = `find out who's bday is coming up`;

    strArgs: string[] = [];

    async executeCommand (message: Message, _args?: string[], bot?: Client): Promise<void> {
        const next = await BdayService.findNext(bot);
        DiscordUtils.sendReply(message, next);
    }

    async executeSlashCommand (interaction: CommandInteraction, bot?: Client): Promise<void> {
        const next = await BdayService.findNext(bot);
        DiscordUtils.replyToInteraction(interaction, next);
    }

}
