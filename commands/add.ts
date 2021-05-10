import { Message, CommandInteraction, CategoryChannel } from "discord.js";
import { Command } from "interfaces/command.interface";
import Axios, { AxiosResponse } from 'axios';
import { DiscordUtils } from '../src/discordUtils'

export default class Add implements Command{
    name: string ='add';
    description: string = `adds a word to be used in an Acronym`;
    strArgs: string[] = ['word'];
    discordUtils = new DiscordUtils();
    dataUrl: string = process.env['WORDS_API_URL'];
    
    async executeCommand(message: Message, args?: string[]): Promise<any> {
        let url = this.dataUrl+'addWord?word='+encodeURIComponent(args[0]);
        try{
            var response = await Axios.post(url, {}, {auth:{
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
        let url = this.dataUrl+'addWord?word='+encodeURIComponent(interaction.options[0].value);
        try{
            var response = await Axios.post(url, {}, {auth:{
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