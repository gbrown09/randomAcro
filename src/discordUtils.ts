import { AxiosResponse } from 'axios';
import { Client, ClientOptions, CommandInteraction, ContextMenuCommandInteraction, IntentsBitField, Message, TextChannel } from 'discord.js';
import { Car } from './interfaces/car.interface';
import Utils from './utils';

export default class DiscordUtils {
    static serverId = process.env.DISCORD_SERVER_ID;

    static async sendChannelMessage (msg: Message, reply: string, del = true): Promise<void> {
        (msg.channel as TextChannel).send(reply);
        if (del)
            await msg.delete();
    }

    static async sendReply (msg: Message, reply: string): Promise<void> {
        msg.reply(reply);
    }

    static async sendChannelMessageInt (interaction: CommandInteraction, message: string): Promise<void> {
        await (interaction.channel as TextChannel).send(message);
    }

    static async replyToInteraction (interaction: CommandInteraction | ContextMenuCommandInteraction, reply: string): Promise<void> {
        await interaction.reply(reply);
    }

    static mentionUser (id: string): string {
        return `<@!${id}>`;
    }

    static async sendToChannelId (channelName: string, reply: string): Promise<void> {
        const intents = new IntentsBitField();
        intents.add(IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds);

        const clientOptions: ClientOptions = {
            intents,
        };
        const bot = new Client(clientOptions);
        bot.on('ready', async () => {
            const server = await bot.guilds.fetch(DiscordUtils.serverId || '');
            const channel = server.channels.cache.get(Utils.channelIds.get(channelName) || '');
            await (channel as TextChannel).send(reply);
        }).destroy();

        bot.login(process.env.BOT_TOKEN);
    }

    static async ecoStringBuilder(client: Client, bdayList: AxiosResponse): Promise<string>{
        let ecoString = `Here's the list of bdays:\n`;
        await bdayList.data.forEach(async (bday: { userId: string; date: any; }) => {
            try{
                const user = await client.users.fetch(bday.userId);
                ecoString += `${user.username}: ${bday.date}\n`;
            } catch(e){
                console.log(e);
            }
        });
        return ecoString;
    }

    static async featStringBuilder(featList: AxiosResponse): Promise<string>{
        let ecoString = `Here's what i should be working on:\n`;
        await featList.data.forEach( (feat: { done: boolean; request: any; userName: any; }, index: number) => {
            if (feat.done === true)
                ecoString += `~~${index+1}. ${feat.request} **Requested By**: ${feat.userName}~~\n`;
            else
                ecoString += `${index+1}. ${feat.request} **Requested By**: ${feat.userName}\n`;
        });
        return ecoString;
    }

    static async carStringBuilder(carList: Car[]): Promise<string>{
        let ecoString = `Here's Everyones Cars:\n`;
        carList.forEach( (car: Car) => {
            ecoString += `${car.owner}: ${car.year} ${car.make} ${car.model}\n`
        });
        return ecoString;
    }

    static chopMessages(message: string, messageBin: string[]) {
        if (message.length <= 2000) {
            messageBin.push(message);
            return messageBin;
        }

        let maxString = message.substring(0, 2000);

        const regex = /[\r\n]+/gm;
        const match = maxString.match(regex)!;
        const lastIndex = maxString.lastIndexOf(match[match.length - 1]);
        if (lastIndex === 2000 - 4) {
            messageBin.push(maxString);
            this.chopMessages(message.substring(lastIndex + 3), messageBin);
        } else {
            messageBin.push(maxString.substring(0, lastIndex));
            this.chopMessages(message.substring(lastIndex), messageBin);
        }
    }
}
