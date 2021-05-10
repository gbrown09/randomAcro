import { Message, CommandInteraction, CategoryChannel, MessageEmbed } from "discord.js";
import { Command } from "interfaces/command.interface";
import Axios, { AxiosResponse } from 'axios';
import { DiscordUtils } from '../src/discordUtils'
import { Utils } from '../src/utils'
import * as NodeEmojis from 'node-emoji'

export default class Poll implements Command{
    name: string ='poll';
    description: string = `make a poll  for votin`;
    strArgs: string[] = ['question; choice; choice;'];
    discordUtils = new DiscordUtils();
    yes = NodeEmojis.get('white_check_mark')
    no = NodeEmojis.get('x')
    
    async executeCommand(message: Message, args?: string[]): Promise<any> {
        const choices = message.content.slice(6).trim().split(';')
        const question = choices[0]
        if (!question){
            this.discordUtils.sendReply(message,`Usage: \`!poll  Question ; Choice 1 ; Choice 2 ; Choice 3 ...\``)
            return;
        }
        choices.shift();
        message.channel.send(this.buildEmbed(question, choices, message.author.id)).then(async (poll) => {
            poll.edit(this.addFooter(question, choices, message.author.id, poll.id))
            this.react(poll, args)
            await message.delete()
          })

          const reactArgs = message.content.slice(6).trim().split(' ')
            if (typeof parseInt(reactArgs[0], 10) === 'number' && reactArgs.length === 1) {
              try {
                    const lastMessage = await message.fetch()
                    const reactions = lastMessage.reactions
                    return message.channel.send(this.buildReactionsList(reactions)).then(async (_) => {
                        await message.delete()
                    })
              } catch (err) {
                    console.log(err)
              }
            }        
    }

    async executeSlashCommand(interaction: CommandInteraction): Promise<any> {
       
        const choices = interaction.options[1].value.toString().trim().split(';')
        const question =  interaction.options[0].value.toString()
        if (!question){
            this.discordUtils.replyToInteraction(interaction,`Usage: \`!poll  Question ; Choice 1 ; Choice 2 ; Choice 3 ...\``)
            return;
        }
        interaction.reply(this.buildEmbed(question, choices, interaction.user.id))
        interaction.editReply(this.addFooter(question, choices, interaction.user.id, interaction.id))
        const pollMessage = await interaction.fetchReply();
        this.react(pollMessage, choices);
        

        const reactArgs = interaction.options[1].value.toString().trim().split(';')
        if (typeof parseInt(reactArgs[0], 10) === 'number' && reactArgs.length === 1) {
            try {
                const lastMessage = await interaction.fetchReply();
                const reactions = lastMessage.reactions
                return interaction.editReply(this.buildReactionsList(reactions))
            } catch (err) {
                console.log(err)
            }
        }

        
    }

    buildEmbed(question, choices, id){
        return new MessageEmbed()
    .setDescription(`🗒 Poll from ${this.discordUtils.mentionUser(id)}`)
    .setColor('#00AE86')
    .addField(`**${question}**`, this.buildChoices(choices))
    }

    buildChoices(choices){
        let choicesStringValue = ''
        if (choices && choices.length > 0) {
            choices.filter((c) => c.length > 0)
            .forEach((choice, iterator) => {
                choicesStringValue += `${Utils.DIGIMOJIS[iterator]} ${choice}\n`
            })
        } else {
            choicesStringValue += `${this.yes} ${this.no}`
        }
        return choicesStringValue
    }

    buildReactionsList (reactions) {
        let res = ''
        reactions.forEach((reaction) => {
          res += `${reaction.emoji} [${reaction.count - 1}]: `
          reaction.users.forEach((user) => {
            if (!user.bot) res += `${this.discordUtils.mentionUser(user.id)} `
          })
          res += '\n'
        })
        return res
      }

    addFooter (question, args, authorID, id) {
        return this.buildEmbed(question, args, authorID).setFooter(`ID: ${id}`)
      }

    async react(poll, args) {
        if (args.length === 0) {
            await poll.react(this.yes)
            await poll.react(this.no)
        } else {
            args = args.filter((arg) => arg.length > 0)
            for (let i = 0; i < args.length; i++) {
            await poll.react(Utils.DIGIMOJIS[i])
            }
        }
    }



}