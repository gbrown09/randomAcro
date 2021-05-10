import * as Discord from 'discord.js';
import { cpuUsage } from 'process';
import { DiscordUtils } from './discordUtils'
import EightBall from '../commands/eightBall'
import { glob, Glob } from "glob"
import { Command } from 'interfaces/command.interface';
import Acro from 'commands/acro'
import { ApplicationCommandData } from 'discord.js';
import { BdayService } from '../services/bday.service';

export class RandomAcro {
    dataUrl: string;
    PREFIX: string;
    discordUtils = new DiscordUtils();

    constructor() {
        this.init();
        this.PREFIX ='!!'
        this.dataUrl = process.env['WORDS_API_URL'];        
    }

    public startBday (bot: Discord.Client){
        try {
            var bdayService = new BdayService(bot);
            bdayService.startJob();
            
        } catch (e) {
            console.log(e)

        }

    }

    async rateLimitByUser(username, time:number, bot:Discord.Client, rate){
        var user = await bot.users.cache.find(user => user.username ==username);
        rate.add(user.id);
        setTimeout(function() {
            rate.delete(user.id)
        }, time)      
    }

    public checkLimit(msg, rate){
        if(rate.has(msg.author.id)){
            this.discordUtils.sendReply(msg, `The all powerful bot creator has decided you're getting too spammy, chill out for a bit and try again later`)
            return true
        }  else {
            return false
        }   
    }

    public checkLimitInter(interaction, rate){
        if(rate.has(interaction.user.id)){
            this.discordUtils.replyToInteraction(interaction, `The all powerful bot creator has decided you're getting too spammy, chill out for a bit and try again later`)
            return true
        }  else {
            return false
        }   
    }

    public init() {     
        const rate = new Set();  
        const commands: Command[] = []
        const data:ApplicationCommandData[]= []
        const intents = new  Discord.Intents(Discord.Intents.NON_PRIVILEGED);
        intents.add('GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'GUILD_MEMBERS');
        const clientOptions: Discord.ClientOptions = {
            intents: intents
        };
        const bot = new Discord.Client(clientOptions);
        let that = this

        bot.on('ready', async function()  {
            var server = await bot.guilds.fetch(that.discordUtils.serverId, true)
            await server.members.fetch();
            that.startBday(bot);
            console.log(`Logged in as ${bot.user.tag}!`);
            const slashglob = new Glob(`${__dirname}/../slashCommands/**/*.js`, async function (er, files) {
                files.forEach(f => {
                  let command = require(f)
                  if(command) {
                    data.push(command);
                  }
                })

                try{
                    await bot.guilds.cache.get('614956907261722687')?.commands.set(data);
                }catch(e){
                    console.log(e)
                }               
              })

            const glob = new Glob(`${__dirname}/../commands/**/*.js`, function (er, files) {
                files.forEach(f => {
                  let commandClass = require(f).default
                  if(commandClass) {
                    const command = new commandClass() as Command
                    commands.push(command);
                  }
                })
              })
            
        });

        bot.on('message', async msg =>{
            if(msg.author.bot) return;
            if(this.checkLimit(msg, rate)) return;

            let cmd = msg.content.substring(this.PREFIX.length).split(" ");
            var command = commands.find(c => c.name === cmd[0].toLowerCase());
            if(command && command.name !== 'acrohelp') {
                cmd.shift();
                await command.executeCommand(msg, cmd, bot);
            } else if(cmd[0] === 'acrohelp') {
                var help = "Here is the list of bot commands: \n"
                commands.forEach(c =>{
                    var commandHelp = `!${c.name}`;
                    if(c.strArgs && c.strArgs.length > 0){
                        c.strArgs.forEach(a => {
                            commandHelp+= ` {${a}} `
                        })
                    }
                    help = `${help} ${commandHelp} - ${c.description}\n`;
                })
                this.discordUtils.sendReply(msg,help);
            } else if(cmd[0] == 'rateLimit') {
                if(msg.author.id == '142777346448031744'){
                this.rateLimitByUser(cmd[1], parseInt(cmd[2]), bot, rate)
                } else {
                    this.discordUtils.sendReply(msg, 'You do not have the power for this')
                }
            }
        })

        bot.on('interaction', async interaction => {
            if (!interaction.isCommand()) return;
            if(this.checkLimitInter(interaction, rate)) return;
            var command = commands.find(c => c.name === interaction.commandName);
            if(command && command.name !== 'help') {
                await command.executeSlashCommand(interaction, bot);
            }
               
        })

        bot.login(process.env["BOT_TOKEN"]);
    }
}