import { SlashCommandBuilder, TextChannel } from "discord.js";
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
            const reply = await Utils.postURL(`${process.env.ACRO_API}/feature-request/create`, featureRequest);
            if (featureRequest.userId === '348947681642545152') {
                await DiscordUtils.replyToInteraction(interaction, `Filing this one away as important thanks ${featureRequest.userName}`)
                await (interaction.channel as TextChannel).send(`https://tenor.com/6R88.gif`)
            } else {
                await interaction.reply(reply.data.message);
            }
        } else {
            const response = await Utils.getURL(`${process.env.ACRO_API}/feature-request/all`);
            const reply = await DiscordUtils.featStringBuilder (response);
            await interaction.deferReply();
            if (reply.length > 2000) {
                let chunks =  new Array<string>();
                DiscordUtils.chopMessages(reply, chunks);
                chunks.forEach(c => {
                    interaction.followUp(c)
                        .catch(e => {
                            console.error('bad stuff', e);
                        });
                    });
                return;
            }
            interaction.followUp(reply);
        }
    }
};

export = command;
