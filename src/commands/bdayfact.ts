import { SlashCommandBuilder } from "discord.js";
import { Command } from '../interfaces/command.interface';
import BdayService from '../services/bday.service';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('bdayfact')
        .setDescription('get a fact for the person who didnt put in their bday'),
    run: async (interaction) =>  {
        const today = Utils.getCurrentDate();
        const newFact = await BdayService.fact(today.substring(0, 2), today.substring(3, 5));
        DiscordUtils.replyToInteraction(interaction, newFact);
    }
};

export = command;
