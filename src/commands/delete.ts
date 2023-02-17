import { SlashCommandBuilder } from 'discord.js';
import { Command } from 'src/interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription(`deletes a word from the list`)
        .addStringOption(option => 
            option.setName('word')
            .setDescription('word that you would like to be removed')
            .setRequired(true)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand()) {
            const url = `${process.env.WORDS_API_URL}deleteWord?word=${encodeURIComponent(interaction.options.getString('word')!)}`;
            const response = await Utils.postURLAuth(url);
            DiscordUtils.replyToInteractionDeffered(interaction, response);
        }
    }
};

export = command;
