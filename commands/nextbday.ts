import { Command } from "interfaces/command.interface";
import { CommandInteraction, Channel, Interaction, Message, MessageEmbed, TextChannel, Client } from 'discord.js'
import { Utils } from '../src/utils'
import { DiscordUtils } from "../src/discordUtils";
import { BdayService } from "../services/bday.service";

export default class NextBday implements Command {
    name: string = 'nextbday';
    description: string = `find out who's bday is coming up`;
    strArgs: string[] =[];
    discordUtils = new DiscordUtils();
    bdayService = new BdayService();

    async executeCommand(message:Message , args?: string[],bot?:Client) {
        var next = await this.findNext(bot);
        this.discordUtils.sendChannelMessage(message, next)   
    }

    async executeSlashCommand(interaction:CommandInteraction, bot?:Client) {
        var next = await this.findNext(bot);
        this.discordUtils.replyToInteraction(interaction, next)     
    }

    async findNext(bot){

        var today = new Date()
        var next = new Date()
        var allDays =[];
        var bdaysNext=[];
        var nextString='';
        var diff={}
        for (const user in this.bdayService.bdays){
          allDays.push(this.bdayService.bdays[user]);
        }
        allDays.forEach(day =>{
          next.setMonth(parseInt(day.substring(0,2))-1)
          next.setDate(parseInt(day.substring(2,4)))
          next.setFullYear(today.getFullYear())
          var diffTime = next.getTime() - today.getTime()
          if (Math.sign(diffTime) == -1){
            next.setFullYear(today.getFullYear()+1)
            diffTime = next.getTime() - today.getTime()
          }
          const diffDays = Math.ceil(diffTime/(1000 * 3600 * 24))
          diff[day] = diffDays
        });
        var difference = 365
        var finalDay=''
        for (const date in diff){
          if (diff[date] < difference){
            difference = diff[date]
            finalDay = date
          }
        }
      
        for(const user in this.bdayService.bdays){
          if(this.bdayService.bdays[user] == finalDay){
            bdaysNext.push(user)
          }
        }
      
        for (const person of bdaysNext){
          try{ 
            var user = await bot.users.fetch(person)
            nextString = nextString + user.username+" "
          }
          catch(e)
          {}
      
        }
        finalDay = `${finalDay.substring(0,2)}/${finalDay.substring(2,4)}` 
        return `The next bday is ${finalDay} which is ${difference} days away. People born that day: ${nextString}`
    }
}