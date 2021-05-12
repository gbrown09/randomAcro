import { CommandInteraction, Message, MessageEmbed } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import DiscordUtils from '../src/discordUtils';
import { get } from 'node-emoji';
import Utils from '../src/utils';

export default class Poll implements Command {
    name = 'poll';

    description = `make a poll  for votin`;

    strArgs: string[] = [ 'question; choice; choice; (if no choices are given it will be yes or no)' ];

    yes = get('white_check_mark');

    no = get('x');

    async executeCommand (message: Message): Promise<void> {
        const choices = message.content.slice(5).trim().split(';');
        const question = choices[0];
        if (!question) {
            DiscordUtils.sendReply(message, `Usage: \`!poll  Question ; Choice 1 ; Choice 2 ; Choice 3 ...\``);
            return;
        }
        choices.shift();
        message.channel.send(this.buildEmbed(question, choices, message.author.id))
            .then(async poll => {
                poll.edit(this.addFooter(question, choices, message.author.id, poll.id));
                this.react(poll, choices);
                await message.delete();
            });

        const reactArgs = message.content.slice(5).trim().split(' ');
        if (typeof parseInt(reactArgs[0]) === 'number' && reactArgs.length === 1)
            try {
                const lastMessage = await message.fetch();
                const { reactions } = lastMessage;
                message.channel.send(Poll.buildReactionsList(reactions)).then(async () => {
                    await message.delete();
                });
            } catch (err) {
                console.log(err);
            }
    }

    async executeSlashCommand (interaction: CommandInteraction): Promise<void> {
        const choices = interaction.options[1].value.toString().trim().split(';');
        const question = interaction.options[0].value.toString();
        if (!question) {
            DiscordUtils.replyToInteraction(interaction, `Usage: \`!poll  Question ; Choice 1 ; Choice 2 ; Choice 3 ...\``);
            return;
        }
        interaction.reply(this.buildEmbed(question, choices, interaction.user.id));
        interaction.editReply(this.addFooter(question, choices,
            interaction.user.id, interaction.id));
        const pollMessage = await interaction.fetchReply();
        this.react(pollMessage, choices);

        const reactArgs = interaction.options[1].value.toString().trim().split(';');
        if (typeof parseInt(reactArgs[0]) === 'number' && reactArgs.length === 1)
            try {
                const lastMessage = await interaction.fetchReply();
                const { reactions } = lastMessage;
                interaction.editReply(Poll.buildReactionsList(reactions));
            } catch (err) {
                console.log(err);
            }
    }

    buildEmbed (question: string, choices: string[], id: string): MessageEmbed {
        return new MessageEmbed()
            .setDescription(`🗒 Poll from ${DiscordUtils.mentionUser(id)}`)
            .setColor('#00AE86')
            .addField(`**${question}**`, this.buildChoices(choices));
    }

    buildChoices (choices: string[]): string {
        let choicesStringValue = '';
        if (choices && choices.length > 0)
            choices.filter(c => c.length > 0)
                .forEach((choice, iterator) => {
                    choicesStringValue += `${Utils.DIGIMOJIS[iterator]} ${choice}\n`;
                });
        else
            choicesStringValue += `${this.yes} ${this.no}`;

        return choicesStringValue;
    }

    static buildReactionsList (reactions: any): string {
        let res = '';
        reactions.forEach(reaction => {
            res += `${reaction.emoji} [${reaction.count - 1}]: `;
            reaction.users.forEach(user => {
                if (!user.bot)
                    res += `${DiscordUtils.mentionUser(user.id)} `;
            });
            res += '\n';
        });
        return res;
    }

    addFooter (question: string, args: string[], authorID: string, id: string): MessageEmbed {
        return this.buildEmbed(question, args, authorID).setFooter(`ID: ${id}`);
    }

    async react (poll: any, args: string[]): Promise<void> {
        if (args.length === 0) {
            await poll.react(this.yes);
            await poll.react(this.no);
        } else {
            const react = args.filter(arg => arg.length > 0);
            let index = -1;
            react.forEach(async () => {
                index += 1;
                await poll.react(Utils.DIGIMOJIS[index]);
            });
        }
    }
}
