import { Client, ClientOptions, Collection, CollectorFilter, IntentsBitField, Message, Partials, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, RESTPostAPIContextMenuApplicationCommandsJSONBody, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import DiscordUtils from './discordUtils';
import { Command } from './interfaces/command.interface';
import BdayService from './services/bday.service';
import Utils from './utils';
import BanService from './services/ban.service';

export default class RandomAcro {
    dataUrl: string;

    PREFIX: string;

    static messageStore = new Map();

    static author = new Set() ;

    constructor() {
        this.init();
        this.PREFIX = '!';
        this.dataUrl = process.env.WORDS_API_URL || '';
        DiscordUtils.serverId = process.env.DISCORD_SERVER_ID;
    }

    static startBday(bot: Client): void {
        try {
            const bdayService = new BdayService(bot);
            bdayService.startJob();
            const banService = new BanService();
            banService.startJob();
        } catch (e) {
            console.log(e);
        }
    }

    static async rateLimitByUser(username: string, time:number, bot:Client, rate: Set<unknown>): Promise<void> {
        try {
            const server = await bot.guilds.fetch(DiscordUtils.serverId || '');
            const user =  await server.members.fetch({query: username, limit:1});
            rate.add(user.first()?.user.id);
            setTimeout(() => {
                rate.delete(user.first()?.user.id);
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
        const commandsJson: (RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[] = [];

        bot.commands = new Collection();
            const commandFiles = readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command: Command = require(`${__dirname}/commands/${file}`);
                if ('data' in command && 'run' in command) {
                    bot.commands.set(command.data.name, command);
                    commandsJson.push(command.data.toJSON())
                }
            }

        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);
        (async () => {
            try {
                console.log(`Started refreshing ${bot.commands.size} application (/) commands.`);
        
                // The put method is used to fully refresh all commands in the guild with the current set
                const data = await rest.put(
                    Routes.applicationGuildCommands(process.env.APPLICATION_ID!, DiscordUtils.serverId!),
                    { body: commandsJson },
                );
        
                //console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                // And of course, make sure you catch and log any errors!
                console.error(error);
            }
        })();
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
        let dfj = message.client.emojis.cache.find(emoji => emoji.name === "JhnFry");
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
        if (content.toLowerCase().includes('idiot bot')) {
            DiscordUtils.sendChannelMessage(message, 'https://tenor.com/view/ryan-stiles-middle-finger-flip-off-pocket-gif-3797474', false);
        }
        if (content.toLowerCase().includes('dfj')){
            DiscordUtils.sendChannelMessage(message, `<:JhnFry:598754412311347200>`);
        }
        if ((message.mentions.users.has('142777346448031744') || content.toLowerCase().includes('grt')) && content.toLowerCase().includes('spider')) {
            DiscordUtils.sendChannelMessage(message, `I think you mean: "${content.replace('spider', 'box')}"`)
        }  
        if (content.toLowerCase() === 'tbf' || content.toLowerCase() === 'to be fair') {
            DiscordUtils.sendChannelMessage(message, `To be faaaaaair`)
        }
    }

    static banRev(message: Message) {
        const filter: CollectorFilter<any> = (reaction: { emoji: { name: string; }; }) => {
            return reaction.emoji.name === 'AniBanned';
        };

        message.awaitReactions({ filter, max:4, time:60000})
        .then(collected => {      
            if (collected.size >= 4) {
               message.member?.timeout(1 * 60 * 1000, 'Bad puns')
            }
        })
        
    }

    public init(): void {
        const rate = new Set();
        //const commands: Command[] = [];
        const botIntents = new IntentsBitField();
        botIntents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.DirectMessages, 
            IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildEmojisAndStickers, IntentsBitField.Flags.MessageContent);
        const clientOptions: ClientOptions = {
            intents: botIntents,
            partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
        };
        const bot = new Client(clientOptions);

        bot.on('ready', async () => {
            const server = await bot.guilds.fetch(DiscordUtils.serverId!);
            await server.members.fetch();
            RandomAcro.startBday(bot);
            bot.commands = new Collection();
            const commandFiles = readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command: Command = require(`${__dirname}/commands/${file}`);
                if ('data' in command && 'run' in command) {
                    bot.commands.set(command.data.name, command);
                }
            }
            
            console.log(`Logged in as ${bot.user?.tag}!`); 
        });

        bot.on('messageCreate', async msg => {            
            if (msg.author.bot)
                return;
            if(Utils.excludedChannels.includes(msg.channel.id)) 
                return;
            RandomAcro.memeStuff(msg.content, msg);
            RandomAcro.theThing(msg);
           if (msg.author.id === '187732585672081409') {
                RandomAcro.banRev(msg);
           }

            const cmd = msg.content.substring(this.PREFIX.length).split(' ');
            const command = bot.commands.get(cmd[0].toLowerCase());
            if (command && command.data.name !== 'acrohelp') {
                if (RandomAcro.checkLimit(msg.author.id, rate)) {
                    DiscordUtils.sendReply(msg, `The all powerful bot creator has decided you're getting too spammy, chill out for a bit and try again later`);
                    return;
                }
                cmd.shift();
                //await command.run(msg, cmd, bot);
            } /* else if (cmd[0] === 'acrohelp') {
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
            } */ else if (cmd[0] === 'rateLimit') {
                if (msg.author.id === '142777346448031744')
                    RandomAcro.rateLimitByUser(cmd[1], parseInt(cmd[2]), bot, rate);
                else
                    DiscordUtils.sendReply(msg, 'You do not have the power for this'); 
            } else if (cmd[0] === 'updateCommands') {
                if (msg.author.id === '142777346448031744') {
                    RandomAcro.updateCommands(bot);
                    console.log("updated commands");
                }
            } else if (cmd[0] === 'test') {
                BdayService.sendBday();
            }
        });

        bot.on('interactionCreate', async interaction => {
            if (!interaction.isCommand() && !interaction.isContextMenuCommand())
                return;
            const command = bot.commands.get(interaction.commandName)
            if (command && command.data.name !== 'help') {
                if (RandomAcro.checkLimit(interaction.user.id, rate)) {
                    DiscordUtils.replyToInteraction(interaction, `The all powerful bot creator has decided you're getting too spammy, chill out for a bit and try again later`);
                    return;
                }
                console.log(`Running ${command.data.name}`)
                await command.run(interaction);
            }
        });

        bot.login(process.env.BOT_TOKEN);
    }
}
