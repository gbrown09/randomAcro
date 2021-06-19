import { CommandInteraction, Message } from "discord.js";
import { AxiosResponse } from "axios";
import { Command } from "../interfaces/command.interface";
import DiscordUtils from "../src/discordUtils";
import { FeatureRequest } from "../interfaces/featureRequest.interface";
import Utils from '../src/utils';

export default class FeatRequest implements Command {
    name = 'featurerequest';

    description= 'Request features for the bot';

    strArgs: string[] = ['feature'];

    async executeCommand(message: Message, args: string[]): Promise<void> {
        if(args.length > 0){
            const featureRequest: FeatureRequest = {
                userId: message.author.id,
                request: message.content.substr(16),
                userName: message.author.username,
                done: false,
            };
            const reply = await Utils.postURL('http://localhost:3000/feature-request/create', featureRequest);
            if (featureRequest.userId === '348947681642545152') {
                DiscordUtils.sendReply(message, `Filing this one away as important thanks ${featureRequest.userName}`);
                DiscordUtils.sendChannelMessage(message, `https://tenor.com/6R88.gif`, false);
            } else {
                DiscordUtils.sendReply(message, reply.data.message);
            }
        } else {
            const response = await Utils.getURL('http://localhost:3000/feature-request/all');
            const reply = await this.featStringBuilder (response);
            DiscordUtils.sendChannelMessage(message, reply, false);
        }

    }
    async executeSlashCommand(interaction: CommandInteraction): Promise<void> {
        if(interaction.options.length > 0) {
            const featureRequest: FeatureRequest = {
                userId: interaction.user.id,
                request: interaction.options.values[0].toString().substr(16),
                userName: interaction.user.username,
                done: false,
            };
            const reply = await Utils.postURL('http://localhost:3000/feature-request/create', featureRequest);
            if (featureRequest.userId === '348947681642545152') {
                DiscordUtils.replyToInteractionDeffered(interaction, `Filing this one away as important thanks ${featureRequest.userName}`);
                DiscordUtils.sendChannelMessageInt(interaction, `https://tenor.com/6R88.gif`);
            } else {
                DiscordUtils.replyToInteractionDeffered(interaction, reply.data.message);
            }
        } else {
            const response = await Utils.getURL('http://localhost:3000/feature-request/all');
            const reply = await this.featStringBuilder (response);
            DiscordUtils.sendChannelMessageInt(interaction, reply);
        }

    }

    async featStringBuilder(featList: AxiosResponse): Promise<string>{
        let ecoString = `Here's what i should be working on:\n`;
        await featList.data.forEach( (feat, index) => {
            if (feat.done === true)
                ecoString += `~~${index+1}. ${feat.request} **Requested By**: ${feat.userName}~~\n`;
            else
                ecoString += `${index+1}. ${feat.request} **Requested By**: ${feat.userName}\n`;
        });
        return ecoString;
    }
    
}