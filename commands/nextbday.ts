import { Client, CommandInteraction, Message } from 'discord.js';
import BdayService from '../services/bday.service';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';

export default class NextBday implements Command {
    name = 'nextbday';

    description = `find out who's bday is coming up`;

    strArgs: string[] = [];

    async executeCommand (message: Message, _args?: string[], bot?: Client): Promise<void> {
        const next = await this.findNext(bot);
        DiscordUtils.sendReply(message, next);
    }

    async executeSlashCommand (interaction: CommandInteraction, bot?: Client): Promise<void> {
        const next = await this.findNext(bot);
        DiscordUtils.replyToInteraction(interaction, next);
    }

    async findNext (bot: Client): Promise<string> {
        const today = new Date();
        const next = new Date();
        const allDays = [];
        const bdaysNext = [];
        let nextString = '';
        const diff = {};

        for (const user in BdayService.bdays)
            allDays.push(BdayService.bdays[user]);

        allDays.forEach(day => {
            next.setMonth(parseInt(day.substring(0, 2)) - 1);
            next.setDate(parseInt(day.substring(2, 4)));
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

        for (const user in BdayService.bdays)
            if (BdayService.bdays[user] === finalDay)
                bdaysNext.push(user);

        for (const person of bdaysNext)
            try {
                const user = await bot.users.fetch(person);
                nextString = `${nextString + user.username} `;
            } catch (e) {
                console.log(e);
            }

        finalDay = `${finalDay.substring(0, 2)}/${finalDay.substring(2, 4)}`;
        return `The next bday is ${finalDay} which is ${difference} days away. People born that day: ${nextString}`;
    }
}
