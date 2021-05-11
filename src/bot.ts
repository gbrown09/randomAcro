import { ApplicationCommandData, Client, ClientOptions, Intents } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from './discordUtils';
import { Glob } from 'glob';

export default class RandomAcro {
    dataUrl: string;

    PREFIX: string;

    constructor () {
        this.init();
        this.PREFIX = '!!';
        this.dataUrl = process.env.WORDS_API_URL;
    }

    static startBday (bot: Client): void {
        try {
            const bdayService = new BdayService(bot);
            bdayService.startJob();
        } catch (e) {
            console.log(e);
        }
    }

    static async rateLimitByUser (username: string, time:number, bot:Client, rate: Set<unknown>): Promise<void> {
        const user = await bot.users.cache.find(person => person.username === username);
        rate.add(user.id);
        setTimeout(() => {
            rate.delete(user.id);
        }, time);
    }

    static checkLimit (id: string, rate: Set<unknown>): boolean {
        const check = !!rate.has(id);
        return check;
    }

    public init (): void {
        const rate = new Set();
        const commands: Command[] = [];
        const data:ApplicationCommandData[] = [];
        const botIntents = new Intents(Intents.NON_PRIVILEGED);
        botIntents.add('GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'GUILD_MEMBERS');
        const clientOptions: ClientOptions = {
            intents: botIntents,
        };
        const bot = new Client(clientOptions);

        bot.on('ready', async () => {
            console.log(DiscordUtils.serverId);
            const server = await bot.guilds.fetch(DiscordUtils.serverId, true);
            await server.members.fetch();
            RandomAcro.startBday(bot);
            console.log(`Logged in as ${bot.user.tag}!`);

            const slashglob = new Glob(`${__dirname}/../slashCommands/**/*.js`, async (er, files) => {
                files.forEach(f => {
                    const command = require(f);
                    if (command)
                        data.push(command);
                });

                try {
                    await bot.guilds.cache.get('614956907261722687')?.commands.set(data);
                } catch (e) {
                    console.log(e);
                }
            });
            const glob = new Glob(`${__dirname}/../commands/**/*.js`, (er, files) => {
                files.forEach(f => {
                    const CommandClass = require(f).default;
                    if (CommandClass) {
                        const command = new CommandClass() as Command;
                        commands.push(command);
                    }
                });
            });
        });

        bot.on('message', async msg => {
            if (msg.author.bot)
                return;

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
