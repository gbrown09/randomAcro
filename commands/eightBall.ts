import { Command } from "interfaces/command.interface";
import { CommandInteraction, Channel, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Utils } from '../src/utils'
import { DiscordUtils } from "../src/discordUtils";

export default class EightBall implements Command {
    name: string = '8ball';
    description: string = 'answers a simple question';
    strArgs: string[] =['question'];
    discordUtils = new DiscordUtils();

    async executeCommand(message:Message , args?: string[]) {
        let index = Math.floor((Math.random() * 13));
        this.discordUtils.sendReply(message, Utils.eightBall[index]);
        
    }

    async executeSlashCommand(interaction:CommandInteraction) {
        let index = Math.floor((Math.random() * 13));
        this.discordUtils.replyToInteraction(interaction, Utils.eightBall[index]);
    }
}