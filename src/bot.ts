import { ApplicationCommandData, Client, ClientOptions, Intents, Message } from 'discord.js';
import { Glob } from 'glob';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from './discordUtils';
import Utils from './utils';

export default class RandomAcro {
    dataUrl: string;

    PREFIX: string;

    static messageStore = new Map();

    static author = new Set() ;

    constructor() {
        this.init();
        this.PREFIX = '!';
        this.dataUrl = process.env.WORDS_API_URL;
        DiscordUtils.serverId = process.env.DISCORD_SERVER_ID;
    }

    static startBday(bot: Client): void {
        try {
            const bdayService = new BdayService(bot);
            bdayService.startJob();
        } catch (e) {
            console.log(e);
        }
    }

    static async rateLimitByUser(username: string, time:number, bot:Client, rate: Set<unknown>): Promise<void> {
        try {
            const server = await bot.guilds.fetch(DiscordUtils.serverId);
            const user =  await server.members.fetch({query: username, limit:1});
            console.log(username);
            rate.add(user.first().user.id);
            setTimeout(() => {
                rate.delete(user.first().user.id);
            }, time);
        } catch(e){
            console.log(e);
        }
    }

    static checkLimit(id: string, rate: Set<unknown>): boolean {
        const check = !!rate.has(id);
        return check;
    }

    static updateCommands(bot: Client): void {
        const data :ApplicationCommandData[] = [];

        const slashglob = new Glob(`${__dirname}/../slashCommands/**/*.js`, async (er, files) => {
            files.forEach(f => {
                const command = require(f);
                if (command)
                    data.push(command);
            });

            try {
                await bot.guilds.cache.get(DiscordUtils.serverId)?.commands.set(data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    static async theThing(message: Message): Promise<void> {
        if (!this.messageStore.has(message.channel.id)) {
            this.messageStore.set(message.channel.id, message);
        } else if((this.messageStore.get(message.channel.id).content === message.content && (this.messageStore.get(message.channel.id).author.id !== message.author.id))) {
            DiscordUtils.sendChannelMessage(message, message.content, false);
            this.messageStore.delete(message.channel.id);
        } else { 
            this.messageStore.set(message.channel.id, message);
        }
    }

    static memeStuff(content: string, message: Message): void {
        if (content.toLowerCase().includes('how many') && content.toLowerCase().includes('?'))
            DiscordUtils.sendChannelMessage(message, '6', false);

        if (content.toLowerCase().includes('bad bot') || content.toLowerCase().includes('stupid bot')) {
            const index = Math.floor(Math.random() * 4);
            DiscordUtils.sendChannelMessage(message, Utils.sad[index], false);
        }
        if (content.toLowerCase().includes('good bot')) {
            const index = Math.floor(Math.random() * 4);
            DiscordUtils.sendChannelMessage(message, Utils.thanks[index], false);
        }
        if (content.toLowerCase().includes('idiot bot'))
            DiscordUtils.sendChannelMessage(message, 'https://tenor.com/view/ryan-stiles-middle-finger-flip-off-pocket-gif-3797474', false);
    }

    public init(): void {
        const rate = new Set();
        const commands: Command[] = [];
        const botIntents = new Intents(Intents.NON_PRIVILEGED);
        botIntents.add('GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'GUILD_MEMBERS');
        const clientOptions: ClientOptions = {
            intents: botIntents,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        };
        const bot = new Client(clientOptions);

        bot.on('ready', async () => {
            const server = await bot.guilds.fetch(DiscordUtils.serverId, true);
            await server.members.fetch();
            RandomAcro.startBday(bot);
            const glob = new Glob(`${__dirname}/../commands/**/*.js`, (er, files) => {
                files.forEach(f => {
                    const CommandClass = require(f).default;
                    if (CommandClass) {
                        const command = new CommandClass() as Command;
                        commands.push(command);
                    }
                });
            });
            console.log(`Logged in as ${bot.user.tag}!`); 
        });

        bot.on('message', async msg => {
            if (msg.author.bot)
                return;
            if(Utils.excludedChannels.includes(msg.channel.id)) 
                return;
            RandomAcro.memeStuff(msg.content, msg);
            RandomAcro.theThing(msg);

            const cmd = msg.content.substring(this.PREFIX.length).split(' ');
            const command = commands.find(c => c.name === cmd[0].toLowerCase());
            if (command && command.name !== 'acrohelp') {
                if (RandomAcro.checkLimit(msg.author.id, rate)) {
                    DiscordUtils.sendReply(msg, `The all powerful bot creator has decided you're getting too spammy, chill out for a bit and try again later`);
                    return;
                }
                cmd.shift();
                await command.executeCommand(msg, cmd, bot);
            } else if (cmd[0] === 'acrohelp') {
                let help = 'Here is the list of bot commands: \n';
                commands.forEach(c => {
                    let commandHelp = `!${c.name}`;
                    if (c.strArgs && c.strArgs.length > 0)
                        c.strArgs.forEach(a => {
                            commandHelp += ` {${a}} `;
                        });

                    help = `${help} ${commandHelp} - ${c.description}\n\n`;
                });
                DiscordUtils.sendReply(msg, help);
            } else if (cmd[0] === 'rateLimit') {
                if (msg.author.id === '142777346448031744')
                    RandomAcro.rateLimitByUser(cmd[1], parseInt(cmd[2]), bot, rate);
                else
                    DiscordUtils.sendReply(msg, 'You do not have the power for this'); 
            } else if (cmd[0] === 'updateCommands') {
                if (msg.author.id === '142777346448031744') {
                    RandomAcro.updateCommands(bot);
                    console.log("updated commands");
                }
            }
        });

        bot.on('interaction', async interaction => {
            if (!interaction.isCommand())
                return;
            const command = commands.find(c => c.name === interaction.commandName);
            if (command && command.name !== 'help') {
                if (RandomAcro.checkLimit(interaction.user.id, rate)) {
                    DiscordUtils.replyToInteraction(interaction, `The all powerful bot creator has decided you're getting too spammy, chill out for a bit and try again later`);
                    return;
                }
                await command.executeSlashCommand(interaction, bot);
            }
        });

        bot.login(process.env.BOT_TOKEN);
    }
}
