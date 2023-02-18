import { SlashCommandBuilder } from 'discord.js';
import DiscordUtils from '../discordUtils';
import { Command } from '../interfaces/command.interface';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
       .setName('twss')
       .setDescription(`good ol twss gifs`),
   run: async (interaction) =>  {
    const index = Math.floor(Math.random() * 4);
    DiscordUtils.replyToInteraction(interaction, Utils.twss[index]);
   }
};

export = command;
