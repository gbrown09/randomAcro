import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription(`answers a simple question`)
        .addStringOption(option => 
            option.setName('question')
            .setDescription('The question you want answered')
            .setRequired(true)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand()) {
            const index = Math.floor(Math.random() * 13);
            const reply = `You asked: ${interaction.options.getString("question")}\nThe answer is: `;
            DiscordUtils.replyToInteraction(interaction, reply+Utils.eightBall[index]);
        }
    }
};

export = command;
