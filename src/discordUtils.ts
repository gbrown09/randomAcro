import { Client, ClientOptions, CommandInteraction, Intents, Message, TextChannel } from 'discord.js';
import Utils from './utils';

export default class DiscordUtils {
    static serverId = '614956907261722687';

    static async sendChannelMessage (msg: Message, reply: string, del = true): Promise<void> {
        msg.channel.send(reply);
        if (del)
            await msg.delete();
    }

    static async sendReply (msg: Message, reply: string): Promise<void> {
        msg.reply(reply);
    }

    static async replyToInteraction (interaction: CommandInteraction, reply: string): Promise<void> {
        await interaction.reply(reply);
    }

    static async replyToInteractionDeffered (interaction: CommandInteraction, reply: string): Promise<void> {
        await interaction.defer();
        await interaction.editReply(reply);
    }

    static mentionUser (id: string): string {
        return `<@!${id}>`;
    }

    static async sendToChannelId (channelName: string, reply: string): Promise<void> {
        const intents = new Intents(Intents.NON_PRIVILEGED);
        intents.add('GUILD_MESSAGES');

        const clientOptions: ClientOptions = {
            intents,
        };
        const bot = new Client(clientOptions);
        bot.on('ready', async () => {
            const server = await bot.guilds.fetch(DiscordUtils.serverId);
            const channel = server.channels.cache.get(Utils.channelIds.get(channelName));
            (channel as TextChannel).send(reply);
        }).destroy();

        bot.login(process.env.BOT_TOKEN);
    }
}
