import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection, CollectorFilter, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../interfaces/command.interface";
import PollService from "../services/poll.service";
import BanService from "../services/ban.service";
import { Ban } from "../interfaces/ban.interface";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pun-ishment')
        .setDescription('vote someone off the island (for a few minutes)')
        .addUserOption(option =>
            option.setName('username')
            .setDescription('username to be voted on')
            .setRequired(true)),
    run: async (interaction) => {
        if (interaction.isChatInputCommand() && interaction.options) {
            const userName = interaction.options.getUser('username')!;
            const victim =  (await interaction.guild?.members.fetch(userName.id))
            if(!victim) {
                interaction.reply({content:"Bad user name :/", ephemeral:true});
                return;
            }
            else if(victim.permissions.has('Administrator') || victim.user.id == '614957304667963441') {
                interaction.reply("Admins/Bots cannot be timed out :/");
                return;
            }
            
            const embed = new EmbedBuilder()
                .setTitle(`Should we BAN ${victim.user.username}?`)
                .setDescription('Vote Yay or Nay')
                .setColor('#00AE86');
            const buttons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${interaction.id}${interaction.user.id}Y`)
                        .setLabel('Yay')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`${interaction.id}${interaction.user.id}N`)
                        .setLabel('Nay')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({embeds: [embed], components: [buttons]});
            const filter: CollectorFilter<any> = i => i.customId === `${interaction.id}${interaction.user.id}Y` || i.customId === `${interaction.id}${interaction.user.id}N`;
            const buttonCollector = (interaction.channel as TextChannel).createMessageComponentCollector({filter, time:  3 * 60 * 1000 });
            let yes: number = 0;
            let no: number = 0;
            let voted: string[] = []
            buttonCollector?.on('collect', i => {
                if (!voted.includes(i.user.id)){
                    if (i.customId === `${interaction.id}${interaction.user.id}Y` ) {
                        voted.push(i.user.id);
                        ++yes;    
                    } else if (i.customId === `${interaction.id}${interaction.user.id}N`) {
                        voted.push(i.user.id)
                        ++no;
                    }  
                    i.reply({content: "Vote Cast Anonymously", ephemeral: true})
                }  else {
                    i.reply({content: "You Already Voted", ephemeral: true})
                }        
            });

            buttonCollector?.on('end', async () => {
                buttons.components[0].setDisabled(true)
                buttons.components[1].setDisabled(true);
                await interaction.editReply({embeds: [embed], components: [buttons]})
                
                const totalVotes: number = yes + no;
                if(totalVotes > 3) {
                    const results: Collection<string, number> = new Collection()
                    let percentYes: number = Math.round((yes/totalVotes) * 100);
                    let percentNo: number = Math.round((no/totalVotes) * 100);
                    if (percentYes > percentNo) {
                        const banInfo = await BanService.banTransaction(victim.user.username);
                        const mult = banInfo.multiplier ?? 0;
                        const minutes = 1 + 1*mult
                        await (interaction.channel as TextChannel).send(`The yays have it say goodbye ${victim}\n You've been banned ${mult} time(s) this month so you're banned for ${minutes} minute(s)`)
                        victim.timeout((minutes) * 60 * 1000, 'Voted Off the Island')
                        const updateBan: Ban = {
                            user: banInfo.user,
                            multiplier: banInfo.multiplier! +1
                        }
                        
                    } else {
                        await (interaction.channel as TextChannel).send('You live another day')
                    }
                    results.set('No', percentNo);
                    results.set('Yes', percentYes);
                    const embedResults = PollService.pollResults(results);
                    embedResults.setFooter({text:`Total Votes: ${totalVotes}`});
                    await (interaction.channel as TextChannel).send({embeds: [embedResults]})
                } else {
                    await (interaction.channel as TextChannel).send('Need at least 3 votes womp womp')
                }
            })
        }
    } 
}

export = command;