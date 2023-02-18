import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription(`adds a word to be used in an Acronym`)
        .addStringOption(option => 
            option.setName('word')
            .setDescription('word that you would like to be added')
            .setRequired(true)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand()) {
            const url = `${process.env.WORDS_API_URL}addWord?word=${encodeURIComponent(interaction.options.getString('word')!)}`;
            const response = await Utils.postURLAuth(url);
            DiscordUtils.replyToInteractionDeffered(interaction, response);
        }
    }
};

export = command;
