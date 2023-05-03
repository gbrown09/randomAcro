import { SlashCommandBuilder } from "discord.js";
import { Command } from "src/interfaces/command.interface";

const command: Command = {
    data: new SlashCommandBuilder()
       .setName('aintreading')
       .setDescription(`TLNR`),
   run: async (interaction) =>  {
    interaction.reply(`I ain't reading all that\nI'm happy for u tho, or sorry that happened`)
   }
};

export = command;
