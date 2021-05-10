import { Command } from "interfaces/command.interface";
import { CommandInteraction, Channel, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js'
import { Utils } from '../src/utils'
import { DiscordUtils } from "../src/discordUtils";
import { BdayService } from "../services/bday.service";

export default class AddBday implements Command {
    name: string = 'addbday';
    description: string = 'add your birthday so I know';
    strArgs: string[] =['date <mm/dd>'];
    discordUtils = new DiscordUtils();
    bdayService = new BdayService();

    async executeCommand(message:Message , args?: string[]) {
        var r = new RegExp('(0\\d{1}|1[0-2])\/(0[1-9]|1\\d|2\\d|3[01])');
        if (r.test(args[0]) != true){
            this.discordUtils.sendReply(message, "Try an actual month dummy, the format is mm/dd pls");
          return;
        } else {
            this.addBday(message, args[0])
        }
        
    }

    async executeSlashCommand(interaction:CommandInteraction) {
        var r = new RegExp('(0\\d{1}|1[0-2])\/(0[1-9]|1\\d|2\\d|3[01])');
        var input = interaction.options[0].value.toString()
        if (r.test(input) != true){
            this.discordUtils.replyToInteraction(interaction, "Try an actual month dummy, the format is mm/dd pls");
          return;
        } else {
            this.addBdayInter(interaction, input)
        }
    }

    addBday(msg, date){
        var id = msg.author.id;
        if(this.bdayService.bdays.hasOwnProperty(id)){
            var month = this.bdayService.bdays[id].substring(0,2)
            var day = this.bdayService.bdays[id].substring(2,4)
            this.discordUtils.sendReply(msg, `I already have your birthday, it's ${month}/${day}`)
        }
        else{
            this.bdayService.bdays[id] = date.substring(0,2)+date.substring(3,5)
            var month = date.substring(0,2);
            var day = date.substring(3,5);
            this.bdayService.writeBdays();
            this.discordUtils.sendReply(msg, `Can't wait for ${month}/${day} it's gonna be lit`)
          
        }
      }

      addBdayInter(interaction, date){
        var id = interaction.user.id;
        if(this.bdayService.bdays.hasOwnProperty(id)){
            var month = this.bdayService.bdays[id].substring(0,2)
            var day = this.bdayService.bdays[id].substring(2,4)
            this.discordUtils.replyToInteraction(interaction, `I already have your birthday, it's ${month}/${day}`)
        }
        else{
            this.bdayService.bdays[id] = date.substring(0,2)+date.substring(3,5)
            var month = date.substring(0,2);
            var day = date.substring(3,5);
            this.bdayService.writeBdays();
            this.discordUtils.replyToInteraction(interaction, `Can't wait for ${month}/${day} it's gonna be lit`)
          
        }
      }

}