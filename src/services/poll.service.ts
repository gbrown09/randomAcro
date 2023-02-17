import { Collection, CommandInteraction, Embed, EmbedBuilder, Emoji, Message, MessageCreateOptions, MessagePayload, MessageReaction, ReactionEmoji } from "discord.js";
import { get } from "node-emoji";
import DiscordUtils from "../discordUtils";
import Utils from "../utils";

export default class PollService {
    
    static yes = get('white_check_mark');

    static no = get('x');

    static buildEmbed (interaction: CommandInteraction): EmbedBuilder {
        let embed = new EmbedBuilder();
        if(interaction.isChatInputCommand()) {
            const question = interaction.options.getString('question');
            let choices: string[] = [];
            if (interaction.options.getString('choices') !== null)
                choices = interaction.options.getString('choices')!.trim().split(';');
            embed.setDescription(`🗒 Poll from ${DiscordUtils.mentionUser(interaction.user.id)}`)
            .setColor('#00AE86')
            .addFields({name:`**${question}**`, value:this.buildChoices(choices)});
        }
        return embed;
    }

    static buildChoices (choices: string[]): string {
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

    static buildReactionsList (reactions: MessageReaction[]): string {

        let res = '';
        reactions.forEach(async reaction => {
            res += `${reaction.emoji.name} [${reaction.count - 1}]: `;
            const users = await reaction.users.fetch();
            users.forEach(user => {
                if (!user.bot)
                    res += `${DiscordUtils.mentionUser(user.id)} `;
            });
            res += '\n';
        });
        return res;
    }

    static addFooter(interaction: CommandInteraction): EmbedBuilder {
        return this.buildEmbed(interaction).setFooter({text:`ID: ${interaction.user.id}`});
    }

    static async react (poll: Message<boolean> , choices: string[]): Promise<void> {
        if (choices.length === 0) {
            await poll.react(this.yes);
            await poll.react(this.no);
        } else {
            const react = choices.filter(choices => choices.length > 0);
            let index = -1;
            react.forEach(async () => {
                index += 1;
                await poll.react(Utils.DIGIMOJIS[index]);
            });
        }
    }

    static pollResults(results: Collection<string, number>): EmbedBuilder {
        let resultsString = ''
        let choices = ''
        results.forEach((result ,choice) => {
            choices += `${choice}\n`
            let bar = `|`
            let num = Math.round(result.valueOf() / 10);
            for (let i = 0; i < num; i++) {
                bar += '='
            }
            bar = bar + ' '.repeat(10 - num) + '|'

            resultsString += `${bar} ${result.toString()}%\n`

        })
        const embed = new EmbedBuilder()
            .setTitle("Poll Results")
            .setColor('#00AE86')
            .addFields({name:`Choices`, value: choices, inline: true})
            .addFields({name:`Results`, value: resultsString, inline: true});
        return embed;
    }
}