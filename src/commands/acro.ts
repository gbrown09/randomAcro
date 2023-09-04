import { SlashCommandBuilder } from 'discord.js';
import DiscordUtils from '../discordUtils';
import { Command } from '../interfaces/command.interface';
import AcroService from '../services/acro.service';


const command: Command = {
    data: new SlashCommandBuilder()
        .setName('acro')
        .setDescription(`gets you the acro you're looking for`)
        .addStringOption(option => 
            option.setName('acronym')
            .setDescription('Acronym you need')
            .setRequired(true)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand() && interaction.options) {
            const response = await AcroService.getAcro(interaction.options.getString('acronym')!);
            DiscordUtils.replyToInteraction(interaction, response);
        }
    }

};

export = command;
