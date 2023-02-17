import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, CollectorFilter, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import DiscordUtils from "../discordUtils";
import { Command } from "../interfaces/command.interface";
import PollService from "../services/poll.service";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pun-ishment')
        .setDescription('vote someone off the island (for a few minutes)')
        .addStringOption(option =>
            option.setName('username')
            .setDescription('username to be voted on')
            .setRequired(true)),
    run: async (interaction) => {
        if (interaction.isChatInputCommand() && interaction.options) {
            const userName = interaction.options.getString('username')!;
            const victim =  (await interaction.guild?.members.fetch({query: userName, limit: 1}))!.first()

            if(!victim) {
                interaction.reply({content:"Bad user name :/", ephemeral:true});
                return;
            }
            else if(victim.permissions.has('Administrator')) {
                interaction.reply("Admins cannot be timed out :/");
                return;
            }
            
            const embed = new EmbedBuilder()
                .setTitle(`Should we BAN ${victim}?`)
                .setDescription('Vote Yay or Nay')
                .setColor('#00AE86');
            const buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('Yes')
                        .setLabel('Yay')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('No')
                        .setLabel('Nay')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({embeds: [embed], components: [buttons]});
            const filter: CollectorFilter<any> = i => i.customId === 'Yes' || i.customId === 'No';
            const buttonCollector = interaction.channel?.createMessageComponentCollector({filter, time:  3 * 60 * 1000 });
            let yes: number = 0;
            let no: number = 0;
            let voted: string[] = []
            buttonCollector?.on('collect', i => {
                if (!voted.includes(i.user.id)){
                    if (i.customId === 'Yes' ) {
                        voted.push(i.user.id);
                        console.log('yes')
                        ++yes;    
                    } else if (i.customId === 'No') {
                        voted.push(i.user.id)
                        ++no;
                        console.log('no')
                    }  
                    i.reply({content: "Vote Cast Anonymously", ephemeral: true})
                }  else {
                    i.reply({content: "You Already Voted", ephemeral: true})
                }        
            });

            buttonCollector?.on('end', async collected => {
                buttons.components[0].setDisabled(true)
                buttons.components[1].setDisabled(true);
                await interaction.editReply({embeds: [embed], components: [buttons]})
                
                const totalVotes: number = collected.size;
                if(totalVotes < 3) {
                    const results: Collection<string, number> = new Collection()
                    let percentYes: number = Math.round((yes/totalVotes) * 100);
                    let percentNo: number = Math.round((no/totalVotes) * 100);
                    if (percentYes > percentNo) {
                        interaction.channel?.send(`The yays have it say goodbye ${victim}`)
                        victim.timeout(3 * 60 * 1000, 'Voted Off the Island')
                        
                    } else {
                        interaction.channel?.send('You live another day')
                    }
                    results.set('No', percentNo);
                    results.set('Yes', percentYes);
                    const embedResults = PollService.pollResults(results);
                    embedResults.setFooter({text:`Total Votes: ${totalVotes}`});
                    interaction.channel?.send({embeds: [embedResults]})
                } else {
                    interaction.channel?.send('Need at least 3 votes womp womp')
                }
            })
        }
    } 
}

export = command;