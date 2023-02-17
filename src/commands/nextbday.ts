import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import BdayService from '../services/bday.service';
import DiscordUtils from '../discordUtils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('nextbday')
        .setDescription(`find out who's bday is coming up`),
    run: async (interaction: CommandInteraction) =>  {
        const next = await BdayService.findNext(interaction.client);
        DiscordUtils.replyToInteraction(interaction, next);
    }
};

export = command;
