import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import BdayService from '../services/bday.service';
import DiscordUtils from '../discordUtils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('addbday')
        .setDescription('add your birthday so I know')
        .addStringOption(option => 
            option.setName('date')
            .setDescription('date of your bday in mm/dd format')
            .setRequired(true)),
    run: async (interaction) =>  {
        if (interaction.isChatInputCommand()) {
            const r = new RegExp('(0\\d{1}|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])');
            const input = interaction.options.getString('date')!;
            if (r.test(input) !== true)
                DiscordUtils.replyToInteraction(interaction, 'Try an actual month dummy, the format is mm/dd pls');
            else
                DiscordUtils.replyToInteraction(interaction, await BdayService.addBday(interaction.user.id, input));
        }
    }
};

export = command;
