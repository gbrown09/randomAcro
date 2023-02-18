import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import BdayService from '../services/bday.service';
import DiscordUtils from '../discordUtils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('bday')
        .setDescription('gets your bday or the person you ask for')
        .addStringOption(option => 
            option.setName('username')
            .setDescription('user name of person whose bday you want to know')
            .setRequired(false)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand()) {
            let bdayService= new BdayService(interaction.client);
            let reply;
            if (interaction.options.data.length === 0) 
                reply = await BdayService.checkBday(interaction.user.id, '');
            else
                reply = await  BdayService.checkBday(interaction.user.id, interaction.options.getString('username')!);
            DiscordUtils.replyToInteraction(interaction, reply);
        }
    }
};

export = command;
