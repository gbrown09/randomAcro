import { CronJob } from 'cron';
import Axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import { Utils } from '../src/utils'
import { DiscordUtils } from '../src/discordUtils'
import * as bdaysList from '../jsons/bdays.json'
import * as Discord from 'discord.js';

export class BdayService {
    bdayJob: CronJob;
    discordUtils: DiscordUtils = new DiscordUtils();;
    bdays: any;
    bot: Discord.Client;

    constructor(bot?:Discord.Client){
        this.bot = bot;
        this.bdays = require('../jsons/bdays.json')
        var that = this;
        this.bdayJob = new CronJob('0 0 8 * * *', function() {
            that.sendBday();
          }, null, true, 'America/Chicago');
    }

    public startJob(){
        this.bdayJob.start();
    }

    public async sendBday(): Promise<void> {
        var today = Utils.getCurrentDate();
        var newFact = await this.fact(today.substring(0,2),today.substring(2,4));
        var bdaysToday= [];
        var bdaystring = 'Happy Birthday! <:birthday:804063725904330772>  '
        for(const user in this.bdays){
          if(this.bdays[user] == today){
            bdaysToday.push(user)
          }
        }
        if(bdaysToday.length > 0){
          bdaysToday.forEach(user => {
            bdaystring = bdaystring + this.discordUtils.mentionUser(user)+' ';
          });
    
        }
        this.discordUtils.sendToChannelId('general', bdaystring+ `<:birthday:804063725904330772> \n\n${newFact}`)

    }

    public async fact(month:string ,day:string) {
        const url= `http://numbersapi.com/${month}/${day}/date`
        var response = await Utils.getURL(url);
        return response.data;
      }

    public async checkBday(msg, input=''){
        var userid;
        var bdayString;
        var noBdayString = 'I have no idea, '
        if (input.trim() == ''){
            userid=msg.author.id;
            bdayString = 'Your bday is'
            noBdayString = noBdayString + 'you need to let me know. Try !addbday'
        }
        else{
            try{
            var user = await this.bot.users.cache.find(user => user.username ==input);
            if (!user){
                this.discordUtils.sendReply(msg,"check the user name, the name before the numbers. No nicknames");
                return;
            }
            userid=user.id
            bdayString = 'Their bday is'
            noBdayString = noBdayString + 'ask them to let me know'
            }
            catch(e){
            console.log(e)
            }
        }
        
        if(this.bdays.hasOwnProperty(userid)){
            var month = this.bdays[userid].substring(0,2)
            var day = this.bdays[userid].substring(2,4)
            var date = new Date()
            var today = new Date()
            var newFact = await this.fact(month,day);
            date.setMonth(parseInt(month)-1)
            date.setDate(parseInt(day))
            date.setFullYear(today.getFullYear())
            var days = this.dateDiff(date)
            this.discordUtils.sendReply(msg, `${bdayString} ${month}/${day} and is ${days} days away. ${newFact}`)
        }
        else{
           this.discordUtils.sendReply(msg,noBdayString)
        }
    }

    public async checkBdaySlash(interaction, input?){
        var userid;
        var bdayString;
        var noBdayString = 'I have no idea, '
        if (input.trim() == ''){
            userid=interaction.user.id;
            bdayString = 'Your bday is'
            noBdayString = noBdayString + 'you need to let me know. Try !addbday'
        }
        else{
            try{
            var user = await this.bot.users.cache.find(user => user.username ==input);
            if (!user){
                this.discordUtils.replyToInteractionDeffered(interaction,"check the user name, the name before the numbers. No nicknames");
                return;
            }
            userid=user.id
            bdayString = 'Their bday is'
            noBdayString = noBdayString + 'ask them to let me know'
            }
            catch(e){
            console.log(e)
            }
        }
        
        if(this.bdays.hasOwnProperty(userid)){
            var month = this.bdays[userid].substring(0,2)
            var day = this.bdays[userid].substring(2,4)
            var date = new Date()
            var today = new Date()
            var newFact = await this.fact(month,day);
            date.setMonth(parseInt(month)-1)
            date.setDate(parseInt(day))
            date.setFullYear(today.getFullYear())
            var days = this.dateDiff(date)
            this.discordUtils.replyToInteractionDeffered(interaction, `${bdayString} ${month}/${day} and is ${days} days away. ${newFact}`)
        }
        else{
           this.discordUtils.replyToInteractionDeffered(interaction,noBdayString)
        }
    }

    dateDiff(date){
        var today = new Date();
        var diffTime = date - today.getTime()
        let next;
        if (Math.sign(diffTime) == -1){
          date.setFullYear(today.getFullYear()+1)
          diffTime = next - today.getTime()
        }
        const diffDays = Math.ceil(diffTime/(1000 * 3600 * 24))
        return diffDays;
      }

      public writeBdays(){
        fs.writeFileSync(`${__dirname}/../jsons/bdays.json`, JSON.stringify(this.bdays, null, 2), 'utf-8')
      }

}