import { AxiosResponse } from 'axios';
import { Client, ClientOptions, CommandInteraction, ContextMenuCommandInteraction, IntentsBitField, Message, TextChannel } from 'discord.js';
import Utils from './utils';

export default class DiscordUtils {
    static serverId = process.env.DISCORD_SERVER_ID;

    static async sendChannelMessage (msg: Message, reply: string, del = true): Promise<void> {
        msg.channel.send(reply);
        if (del)
            await msg.delete();
    }

    static async sendReply (msg: Message, reply: string): Promise<void> {
        msg.reply(reply);
    }

    static async replyToInteraction (interaction: CommandInteraction | ContextMenuCommandInteraction, reply: string): Promise<void> {
        await interaction.reply(reply);
    }

    static async replyToInteractionDeffered (interaction: CommandInteraction | ContextMenuCommandInteraction, reply: string): Promise<void> {
        await interaction.deferReply();
        await interaction.editReply(reply);
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
            (channel as TextChannel).send(reply);
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
}
