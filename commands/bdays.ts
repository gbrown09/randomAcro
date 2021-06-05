import { Client, CommandInteraction, Message } from 'discord.js';
import { AxiosResponse } from 'axios';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class Twss implements Command {
    name = 'bdays';

    description = `gets a list of bdays`;

    strArgs: string[] = [];

    async executeCommand (message: Message): Promise<void> {
        const bdayList = await Utils.getURL('http://localhost:3000/bday/bdays');
        const reply = await this.ecoStringBuilder(message.client, bdayList);
        DiscordUtils.sendChannelMessage(message, reply, false);
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const bdayList = await Utils.getURL('http://localhost:3000/bday/bdays');
        const reply = await this.ecoStringBuilder(interaction.client, bdayList);
        DiscordUtils.replyToInteractionDeffered(interaction, reply);
    }

    async ecoStringBuilder(client: Client, bdayList: AxiosResponse): Promise<string>{
        let ecoString = `Here's the list of bdays:\n`;
        await bdayList.data.forEach(async (bday) => {
            try{
                const user = await client.users.fetch(bday.userId);
                ecoString += `${user.username}: ${bday.date}\n`;
            } catch(e){
                console.log(e);
            }
        });
        return ecoString;
    }
}
