import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { Phil } from "src/interfaces/phil.interface";
import { Command } from "../interfaces/command.interface";
import DiscordUtils from "../discordUtils";
import Utils from "../utils";

const command: Command = {
    data: new ContextMenuCommandBuilder()
        .setName('philAdd')
        .setType(ApplicationCommandType.Message),
    run: async (interaction) =>  {
            if (interaction.isContextMenuCommand()){
            if (interaction.options.getMessage('message')!.author.id === '348947681642545152') {
                const philText: Phil = {
                    philText: interaction.options.getMessage('message')!.content
                };
                const reply = await Utils.postURL(`${process.env.ACRO_API}/phil/create`, philText);
                DiscordUtils.replyToInteraction(interaction, reply.data.message);
            } else 
                DiscordUtils.replyToInteraction(interaction, `Looks like Phil didn't say that`);
        }
    }
};

export = command;