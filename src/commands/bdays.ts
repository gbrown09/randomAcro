import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('bdays')
        .setDescription('get a list of all the bdays'),
    run: async (interaction) =>  {
        const bdayList = await Utils.getURL('${process.env.ACRO_API}/bday/bdays');
        const reply = await DiscordUtils.ecoStringBuilder(interaction.client, bdayList);
        DiscordUtils.replyToInteraction(interaction, reply);
    }
};

export = command;
