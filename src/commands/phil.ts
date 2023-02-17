import { SlashCommandBuilder } from "discord.js";
import { Phil } from "src/interfaces/phil.interface";
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('phil')
        .setDescription(`phils thoughts`)
        .addStringOption(option => 
            option.setName('philism')
            .setDescription('what phil said')
            .setRequired(true)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand()) {
            if(interaction.options.data.length > 0) {
                const philText: Phil = {
                    philText: interaction.options.getString('philism')!
                };
                const reply = await Utils.postURL('http://backend:3000/phil/create', philText);
                DiscordUtils.replyToInteractionDeffered(interaction, reply.data.message);   
            } else {
                const response = await Utils.getURL('http://backend:3000/phil/phils');
                const index = Math.floor(Math.random() * response.data.length);
                DiscordUtils.replyToInteraction(interaction, response.data[index].philText);
            }
        }
    }
};

export = command;
