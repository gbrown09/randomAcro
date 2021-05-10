import { Command } from "interfaces/command.interface";
import { CommandInteraction, Channel, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Utils } from '../src/utils'
import { DiscordUtils } from "../src/discordUtils";
import { BdayService } from "../services/bday.service";

export default class NextBday implements Command {
    name: string = 'deletebday';
    description: string = 'delete your bday cause you like secrets"';
    strArgs: string[] =[];
    discordUtils = new DiscordUtils();
    bdayService = new BdayService();

    async executeCommand(message:Message , args?: string[]) {
        var id = message.author.id;
        if(this.bdayService.bdays.hasOwnProperty(id)){
            delete this.bdayService.bdays[id]
            this.bdayService.writeBdays();
            this.discordUtils.sendReply(message, `Your bday has been deleted, guess you hate celebrations`)
        }
        else{
            this.discordUtils.sendReply(message, `I don't have your bday`)
          
        }     
    }

    async executeSlashCommand(interaction:CommandInteraction) {
        var id = interaction.user.id;
        if(this.bdayService.bdays.hasOwnProperty(id)){
            delete this.bdayService.bdays[id]
            this.bdayService.writeBdays();
            this.discordUtils.replyToInteraction(interaction, `Your bday has been deleted, guess you hate celebrations`)
        }
        else{
            this.discordUtils.replyToInteraction(interaction, `I don't have your bday`)
          
        }       
    }
}