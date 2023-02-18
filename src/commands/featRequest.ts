import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/command.interface";
import { FeatureRequest } from "../interfaces/featureRequest.interface";
import DiscordUtils from "../discordUtils";
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('featurerequest')
        .setDescription(`Request features for the bot`)
        .addStringOption(option => 
            option.setName('feature')
            .setDescription('desired feature')
            .setRequired(false)),
    run: async (interaction) =>  {
        if(interaction.options.data.length > 0 && interaction.isChatInputCommand()) {
            const featureRequest: FeatureRequest = {
                userId: interaction.user.id,
                request: interaction.options.getString('feature')!,
                userName: interaction.user.username,
                done: false,
            };
            const reply = await Utils.postURL('http://backend:3000/feature-request/create', featureRequest);
            if (featureRequest.userId === '348947681642545152') {
                DiscordUtils.replyToInteractionDeffered(interaction, `Filing this one away as important thanks ${featureRequest.userName}`);
                DiscordUtils.sendToChannelId(interaction.channelId, `https://tenor.com/6R88.gif`);
            } else {
                DiscordUtils.replyToInteractionDeffered(interaction, reply.data.message);
            }
        } else {
            const response = await Utils.getURL('http://backend:3000/feature-request/all');
            const reply = await DiscordUtils.featStringBuilder (response);
            DiscordUtils.replyToInteraction(interaction, reply);
        }
    }
};

export = command;
