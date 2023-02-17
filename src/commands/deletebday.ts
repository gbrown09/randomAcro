import Axios from 'axios';
import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../discordUtils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('deletebday')
        .setDescription(`delete your bday cause you like secrets`),
    run: async (interaction) =>  {
        const { id } = interaction.user;
        try {
            await Axios.delete(`http://backend:3000/bday/delete?id=${id}`);
            DiscordUtils.replyToInteraction(interaction, `Your bday has been deleted, guess you hate celebrations`);
        } catch(e) {
            DiscordUtils.replyToInteraction(interaction, `I don't have your bday`);
        }
    }
};

export = command;
