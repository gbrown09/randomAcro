import { SlashCommandBuilder } from 'discord.js';
import DiscordUtils from '../discordUtils';
import { Command } from '../interfaces/command.interface';
import Utils from '../utils';


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
            const url = `${process.env.WORDS_API_URL}randomGet?acronym=${encodeURIComponent(interaction.options.getString('acronym')!)}`;
            const response = await Utils.getURLAuth(url);
            DiscordUtils.replyToInteraction(interaction, response);
        }
    }

};

export = command;
