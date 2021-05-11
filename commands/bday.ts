import { Client, CommandInteraction, Message } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';

export default class Bday implements Command {
    name = 'bday';

    description = `gets your bday or someone elses if you provide a username`;

    strArgs: string[] = [ 'username' ];

    bdayService = new BdayService();

    async executeCommand (message: Message, args?: string[], bot?: Client): Promise<void> {
        this.bdayService = new BdayService(bot);
        if (args[0] === '')
            BdayService.checkBday(message, '');

        else
            BdayService.checkBday(message, args[0]);
    }

    async executeSlashCommand (interaction: CommandInteraction, bot?: Client): Promise<void> {
        this.bdayService = new BdayService(bot);
        if (interaction.options.length === 0)
            BdayService.checkBdaySlash(interaction, '');

        else
            BdayService.checkBdaySlash(interaction, interaction.options[0].value.toString());
    }
}
