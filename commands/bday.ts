import { Message, CommandInteraction, CategoryChannel, Client } from "discord.js";
import { Command } from "interfaces/command.interface";
import Axios, { AxiosResponse } from 'axios';
import { DiscordUtils } from '../src/discordUtils'
import { BdayService } from '../services/bday.service';

export default class Bday implements Command{
    name: string ='bday';
    description: string = `gets your bday or someone elses if you provide a username`;
    strArgs: string[] = ['username'];
    discordUtils = new DiscordUtils();
    bdayService = new BdayService();
    
    async executeCommand(message: Message, args?: string[], bot?:Client): Promise<any> {
      this.bdayService = new BdayService(bot);
      if(args[0] === ''){
        this.bdayService.checkBday(message, '')
      }
      else{
        this.bdayService.checkBday(message, args[0])
      }
    }
    
    async executeSlashCommand(interaction: CommandInteraction, bot?:Client): Promise<any> {
      this.bdayService = new BdayService(bot);
      if(interaction.options.length == 0){
        this.bdayService.checkBdaySlash(interaction, '')
      }
      else{
        this.bdayService.checkBdaySlash(interaction, interaction.options[0].value)
      }

        
    }

}