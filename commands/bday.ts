import { Client, CommandInteraction, Message } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';

export default class Bday implements Command {
    name = 'bday';

    description = `gets your bday or someone elses if you provide a username`;

    strArgs: string[] = [ 'username' ];

    bdayService = new BdayService();

    async executeCommand (message: Message, args?: string[], bot?: Client): Promise<void> {
        this.bdayService = new BdayService(bot);
        let reply;
        if (args[0] === '') 
            reply = await BdayService.checkBday(message.author.id, '');
        else
            reply = await BdayService.checkBday(message.author.id, args[0]);
        DiscordUtils.sendReply(message, reply);
    }

    async executeSlashCommand (interaction: CommandInteraction, bot?: Client): Promise<void> {
        this.bdayService = new BdayService(bot);
        let reply;
        if (interaction.options.data.length === 0) 
            reply = await BdayService.checkBday(interaction.user.id, '');
        else
            reply = await  BdayService.checkBday(interaction.user.id, interaction.options.getString('username'));
        DiscordUtils.replyToInteraction(interaction, reply);
    }
}
