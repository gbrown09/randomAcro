import { Client, CommandInteraction, Message } from 'discord.js';
import { CronJob } from 'cron';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';
import { writeFileSync } from 'fs';

export default class BdayService {
    bdayJob: CronJob;

    static bdays = require('../../jsons/bdays.json');

    static bot: Client;

    constructor (bot?: Client) {
        BdayService.bot = bot;

        this.bdayJob = new CronJob('0 0 8 * * *', () => {
            BdayService.sendBday();
        }, null, true, 'America/Chicago');
    }

    public startJob (): void {
        this.bdayJob.start();
    }

    public static async sendBday (): Promise<void> {
        const today = Utils.getCurrentDate();
        const newFact = await BdayService.fact(today.substring(0, 2), today.substring(2, 4));
        const bdaysToday = [];
        let bdaystring = 'Happy Birthday! <:birthday:804063725904330772>  ';
        for (const user in BdayService.bdays)
            if (BdayService.bdays[user] === today)
                bdaysToday.push(user);

        if (bdaysToday.length > 0) {
            bdaysToday.forEach(user => {
                bdaystring = `${bdaystring + DiscordUtils.mentionUser(user)} `;
            });
            DiscordUtils.sendToChannelId('general', `${bdaystring}<:birthday:804063725904330772> \n\n${newFact}`);
        }

    }

    static async fact (month: string, day: string): Promise<string> {
        const url = `http://numbersapi.com/${month}/${day}/date`;
        const response = await Utils.getURL(url);
        return response;
    }

    public static async checkBday (msg: Message, input = ''): Promise<void> {
        let userid;
        let bdayString;
        let noBdayString = 'I have no idea, ';
        if (input.trim() === '') {
            userid = msg.author.id;
            bdayString = 'Your bday is';
            noBdayString = `${noBdayString}you need to let me know. Try !addbday`;
        } else {
            try {
                const server = await BdayService.bot.guilds.fetch(DiscordUtils.serverId);
                const user =  await server.members.fetch({query: input, limit:1});
                if (!user) {
                    DiscordUtils.sendReply(msg, 'check the user name, the name before the numbers. No nicknames');
                    return;
                }
                userid = user.first().user.id;
                bdayString = 'Their bday is';
                noBdayString = `${noBdayString}ask them to let me know`;
            } catch (e) {
                console.log(e);
            }
        }

        if (Object.prototype.hasOwnProperty.call(BdayService.bdays, userid)) {
            const month = BdayService.bdays[userid].substring(0, 2);
            const day = BdayService.bdays[userid].substring(2, 4);
            const date = new Date();
            const today = new Date();
            const newFact = await BdayService.fact(month, day);
            date.setMonth(parseInt(month) - 1);
            date.setDate(parseInt(day));
            date.setFullYear(today.getFullYear());
            const days = BdayService.dateDiff(date);
            DiscordUtils.sendReply(msg, `${bdayString} ${month}/${day} and is ${days} days away. ${newFact}`);
        } else {
            DiscordUtils.sendReply(msg, noBdayString);
        }
    }

    public static async checkBdaySlash (interaction: CommandInteraction, input?: string): Promise<void> {
        let userid;
        let bdayString;
        let noBdayString = 'I have no idea, ';
        if (input.trim() === '') {
            userid = interaction.user.id;
            bdayString = 'Your bday is';
            noBdayString = `${noBdayString}you need to let me know. Try !addbday`;
        } else {
            try {
                const user = await BdayService.bot.users.cache.find(person => person.username === input);
                if (!user) {
                    DiscordUtils.replyToInteractionDeffered(interaction, 'check the user name, the name before the numbers. No nicknames');
                    return;
                }
                userid = user.id;
                bdayString = 'Their bday is';
                noBdayString = `${noBdayString}ask them to let me know`;
            } catch (e) {
                console.log(e);
            }
        }

        if (Object.prototype.hasOwnProperty.call(BdayService.bdays, userid)) {
            const month = BdayService.bdays[userid].substring(0, 2);
            const day = BdayService.bdays[userid].substring(2, 4);
            const date = new Date();
            const today = new Date();
            const newFact = await BdayService.fact(month, day);
            date.setMonth(parseInt(month) - 1);
            date.setDate(parseInt(day));
            date.setFullYear(today.getFullYear());
            const days = BdayService.dateDiff(date);
            DiscordUtils.replyToInteractionDeffered(interaction, `${bdayString} ${month}/${day} and is ${days} days away. ${newFact}`);
        } else {
            DiscordUtils.replyToInteractionDeffered(interaction, noBdayString);
        }
    }

    static dateDiff (date: Date): number {
        const today = new Date();
        let diffTime = date.getTime() - today.getTime();
        let next: Date;
        if (Math.sign(diffTime) === -1) {
            date.setFullYear(today.getFullYear() + 1);
            diffTime = next.getTime() - today.getTime();
        }
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        return diffDays;
    }

    public static writeBdays (): void {
        writeFileSync(`${__dirname}/../../jsons/bdays.json`, JSON.stringify(BdayService.bdays, null, 2), 'utf-8');
    }
}
