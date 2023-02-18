import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
     data: new SlashCommandBuilder()
        .setName('rekt')
        .setDescription(`get rekt`),
    run: async (interaction) =>  {
        DiscordUtils.replyToInteraction(interaction, Utils.rekt[0]);        
    }
};

export = command;
