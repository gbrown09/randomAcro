import { Collection, MessageReaction, SlashCommandBuilder } from 'discord.js';
import { get } from 'node-emoji';
import DiscordUtils from '../discordUtils';
import { Command } from '../interfaces/command.interface';
import PollService from '../services/poll.service';
import Utils from '../utils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription(`make a poll  for voting`)
        .addStringOption(option => 
            option.setName('question')
            .setDescription('what are you asking the people')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('choices')
            .setDescription('give the people choices to vote on seperated by ;')
            .setRequired(false))
        .addIntegerOption(option =>
            option.setName('time')
            .setDescription('time(in mins) you want the poll open (Default:5)')
            .setRequired(false)),
    run: async (interaction) =>  {
        const pollService = new PollService();
        if (interaction.isChatInputCommand()) {
            let choices: string[] =[];
            if (interaction.options.getString('choices') !== null)
                choices = interaction.options.getString('choices')!.trim().split(';');
         
            const question = interaction.options.getString('question');
            if (!question) {
                DiscordUtils.replyToInteraction(interaction, `Usage: \`!poll  Question ; Choice 1 ; Choice 2 ; Choice 3 ...\``);
                return;
            }

            const minutes = interaction.options.getInteger('time') || 5

            const embed = PollService.buildEmbed(interaction, minutes);
            await interaction.reply({embeds: [embed]});

            const embedFooter = PollService.addFooter(interaction, minutes);
            interaction.editReply({ embeds: [embedFooter]});
            const pollMessage = await interaction.fetchReply();
            
            const reactionCollector = pollMessage.createReactionCollector({time: minutes * 60 * 1000})
            await PollService.react(pollMessage, choices);
            

            const reactionCollection: Collection<string, number> = new Collection();
    
            let reactArgs: string | any[] =[];
            if (interaction.options.getString('choices') !== null)
                reactArgs = interaction.options.getString('choices')!.trim().split(';');
    
            if (typeof parseInt(reactArgs[0]) === 'number' && reactArgs.length === 1)
                try {
                    const lastMessage = await interaction.fetchReply();
                    const reactions: MessageReaction[] = [];
                    Object.keys(lastMessage.reactions.cache)
                    lastMessage.reactions.cache.forEach((reaction: MessageReaction) => {
                        reactions.push(reaction)
                    })
                    interaction.editReply(PollService.buildReactionsList(reactions));
                } catch (err) {
                    console.log(err);
                }
            

            reactionCollector.on('end', collected => {
                if (choices && choices.length === 0){
                    choices.push('Yes');
                    choices.push('No')
                }
                let totalVotes = 0;
                for (const [value, key] of collected) {
                    totalVotes += key.count - 1;

                }
                
                let count = 0;
                collected.forEach((key, value) => {
                    if(Utils.DIGIMOJIS.includes(get(key.emoji.name!)) || 
                    (key.emoji.name! === get('white_check_mark') || key.emoji.name! === get('x'))) {
                        let reactionCount = key.count - 1;
                        reactionCollection.set(choices[count], Math.round((reactionCount/totalVotes) * 100));
                        ++count
                    }

                });
                const embedResults = PollService.pollResults(reactionCollection);
                embedResults.setTitle(`The Winner Is: **${reactionCollection.sort((A, B) => B - A).firstKey()}**`)
                embedResults.setFooter({text:`Total Votes: ${totalVotes}`});
                interaction.channel?.send({embeds: [embedResults]});
            });
        }
    }
};

export = command;
