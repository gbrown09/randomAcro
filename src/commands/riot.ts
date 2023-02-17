import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
       .setName('riot')
       .setDescription(`we riot!!!`),
   run: async (interaction) =>  {
    const index = Math.floor(Math.random() * 4);
    DiscordUtils.replyToInteraction(interaction, Utils.riot[index]);      
   }
};

export = command;
