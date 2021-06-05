import { Bday } from '../interfaces/bday.interface';
import { Client } from 'discord.js';
import { CronJob } from 'cron';
import DiscordUtils from '../src/discordUtils';
import Utils from '../src/utils';

export default class BdayService {
    bdayJob: CronJob;

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
        const newFact = await BdayService.fact(today.substring(0, 2), today.substring(3, 5));
        const bdayList = await Utils.getURL('http://localhost:3000/bday/bdays');
        const bdaysToday = [];
        let bdaystring = 'Happy Birthday! <:birthday:804063725904330772>  ';
        bdayList.data.forEach(bday => {
            if (bday.date === today)
                bdaysToday.push(bday.userId);
        });
           

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
        return response.data;
    }

    public static async checkBday (id: string, input = ''): Promise<string> {
        let userid;
        let bdayString;
        let noBdayString = 'I have no idea, ';
        if (input.trim() === '') {
            userid = id;
            bdayString = 'Your bday is';
            noBdayString = `${noBdayString}you need to let me know. Try !addbday`;
        } else {
            try {
                const server = await BdayService.bot.guilds.fetch(DiscordUtils.serverId);
                const user =  await server.members.fetch({query: input, limit:1});
                if (!user) 
                    return 'check the user name, the name before the numbers. No nicknames';
                
                userid = user.first().user.id;
                bdayString = 'Their bday is';
                noBdayString = `${noBdayString}ask them to let me know`;
            } catch (e) {
                console.log(e);
            }
        }
        let response;
        try {
            response = await Utils.getURL(`http://localhost:3000/bday/bday/${userid}`);
        } catch(e){
            return noBdayString;
        }

        const month = response.data.date.substring(0, 2);
        const day = response.data.date.substring(3, 5);
        const date = new Date();
        const today = new Date();
        const newFact = await BdayService.fact(month, day);
        date.setMonth(parseInt(month) - 1);
        date.setDate(parseInt(day));
        date.setFullYear(today.getFullYear());
        const days = BdayService.dateDiff(date);
        return `${bdayString} ${month}/${day} and is ${days} days awaytest. ${newFact}`;
    }

    public static async addBday (id: string, date: string): Promise<string> {
        const bday: Bday = {
            userId: id,
            date
        };
        try {
            const response = await Utils.postURL('http://localhost:3000/bday/create', bday);
            const month = response.data.date.substring(0, 2);
            const day = response.data.date.substring(3, 5);
            return `Can't wait for ${month}/${day} it's gonna be lit`;     
        } catch (error) {
            const response = await Utils.getURL(`http://localhost:3000/bday/bday/${id}`);
            const month = response.data.date.substring(0, 2);
            const day = response.data.date.substring(3, 5);
            return `I already have your birthday, it's ${month}/${day}`;
        }
    }

    public static async findNext (bot: Client): Promise<string> {
        const today = new Date();
        const next = new Date();
        const allDays = [];
        const bdaysNext = [];
        let nextString = '';
        const diff = {};

        const bdayList = await Utils.getURL('http://localhost:3000/bday/bdays');
        bdayList.data.forEach(bday => {
            allDays.push(bday.date);
        });

        allDays.forEach(day => {
            next.setMonth(parseInt(day.substring(0, 2)) - 1);
            next.setDate(parseInt(day.substring(3, 5)));
            next.setFullYear(today.getFullYear());
            let diffTime = next.getTime() - today.getTime();
            if (Math.sign(diffTime) === -1) {
                next.setFullYear(today.getFullYear() + 1);
                diffTime = next.getTime() - today.getTime();
            }
            const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
            diff[day] = diffDays;
        });
        let difference = 365;
        let finalDay = '';
        for (const date in diff)
            if (diff[date] < difference) {
                difference = diff[date];
                finalDay = date;
            }

        bdayList.data.forEach(bday => {
            if (bday.date === finalDay)
                bdaysNext.push(bday.userId);
        });

        for (const person of bdaysNext)
            try {
                const user = await bot.users.fetch(person);
                nextString = `${nextString + user.username} `;
            } catch (e) {
                console.log(e);
            }

        finalDay = `${finalDay.substring(0, 2)}/${finalDay.substring(3, 5)}`;
        return `The next bday is ${finalDay} which is ${difference} days away. People born that day: ${nextString}`;
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
}
