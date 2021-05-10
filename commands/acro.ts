import { Message, CommandInteraction, CategoryChannel } from "discord.js";
import { Command } from "interfaces/command.interface";
import Axios, { AxiosResponse } from 'axios';
import { DiscordUtils } from '../src/discordUtils'

export default class Acro implements Command{
    name: string ='acro';
    description: string = `gets you the acro you're looking for`;
    strArgs: string[] = ['acronym'];
    discordUtils = new DiscordUtils();
    dataUrl: string = process.env['WORDS_API_URL'];
    
    async executeCommand(message: Message, args?: string[]): Promise<any> {
        let url = this.dataUrl+'randomGet?acronym='+encodeURIComponent(args[0]);
        try{
            var response = await Axios.get(url ,{auth:{
                username: process.env['USER_NAME'],
                password: process.env['PASSWORD']
            }});
        }
        catch(e){
            console.log(e)
        }
        this.discordUtils.sendReply(message, response.data)
    }
    
    async executeSlashCommand(interaction: CommandInteraction): Promise<any> {
        let url = this.dataUrl+'randomGet?acronym='+encodeURIComponent(interaction.options[0].value);
        console.log(process.env['USER_NAME'])
        try{
            var response = await Axios.get(url ,{auth:{
                username: process.env['USER_NAME'],
                password: process.env['PASSWORD']
            }});
        }
        catch(e){
            console.log(e)
        }
        this.discordUtils.replyToInteractionDeffered(interaction, response.data)

        
    }

}