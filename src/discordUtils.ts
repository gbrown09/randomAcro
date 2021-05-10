import { Message, CommandInteraction, Intents, ClientOptions, Client, TextChannel } from 'discord.js';
import { Utils } from './utils'

export class DiscordUtils{
    serverId: string;
    
    constructor(){
        this.serverId = '614956907261722687'
    }

    sendChannelMessage(msg: Message, reply: string): void {
        msg.channel.send(reply);
    }

    sendReply(msg: Message, reply: string): void {
        msg.reply(reply);
    }

    async replyToInteraction(interaction: CommandInteraction, reply: string): Promise<any> {
        await interaction.reply(reply);
    }

    async replyToInteractionDeffered(interaction: CommandInteraction, reply: string): Promise<any> {
        await interaction.defer();
        await interaction.editReply(reply);
    }


    mentionUser(id:string): string {
        return `<@!${id}>`;
    }

    async sendToChannelId(channelName: string, reply: string): Promise<void> {
        const intents = new  Intents(Intents.NON_PRIVILEGED);
        intents.add('GUILD_MESSAGES');
        
        const clientOptions: ClientOptions = {
            intents: intents
        };
        const bot = new Client(clientOptions);
        bot.on('ready', async () =>{
        var server = await bot.guilds.fetch(this.serverId);
        var channel = server.channels.cache.get(Utils.channelIds.get(channelName));
        (channel as TextChannel).send(reply)

        }).destroy()

        bot.login(process.env["BOT_TOKEN"]);

        
    }

}