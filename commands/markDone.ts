import { Command } from "../interfaces/command.interface";
import DiscordUtils from "../src/discordUtils";
import { Message } from "discord.js";
import Utils from '../src/utils';

export default class FeatRequest implements Command {
    name = 'markdone';

    description= 'marks requests as done';

    strArgs: string[] = ['request string'];

    async executeCommand(message: Message): Promise<void> {
        if (message.author.id === '142777346448031744'){
            const done = await Utils.postURL('http://localhost:3000/feature-request/update', {request: message.content.substring(10)});
            DiscordUtils.sendReply(message, await done.data.message);
        }
        else {
            DiscordUtils.sendReply(message, `You can't do that`);
        }
    }
    async executeSlashCommand(): Promise<void> {
        return;
    }
    
}