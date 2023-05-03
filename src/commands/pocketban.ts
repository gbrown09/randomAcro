import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/command.interface';
import BanService from '../services/ban.service';
import { Ban } from '../interfaces/ban.interface';
import DiscordUtils from '../discordUtils';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('pocketban')
        .setDescription('someone has a pocketban ready to use')
        .addSubcommand(subcommand => 
            subcommand.setName('timeout')
            .setDescription('timeout someone')
            .addUserOption(option => 
                option.setName('username')
                .setDescription('username to ban')
                .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('give')
            .setDescription('give someone a pocket ban(admin only)')
            .addStringOption(option => 
                option.setName('type')
                .setDescription('type of ban to give out')
                .setRequired(true)
                .addChoices(
                    {name:'Roaming', value: 'roaming'},
                    {name: 'One-Time', value: 'oneTime'}
                ))
            .addUserOption(option => 
                option.setName('username')
                .setDescription('username to bequeath')
                .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('check')
            .setDescription('check who has a pocket ban or how many times you have been banned this month')
            .addUserOption(option => 
                option.setName('username')
                .setDescription('username to bequeath')
                .setRequired(false))),
    run: async (interaction) => {
        if(interaction.isChatInputCommand() && interaction.options) {
            switch(interaction.options.getSubcommand()) {
                case'timeout': {
                    const userName = interaction.options.getUser('username')!;
                    const victim =  (await interaction.guild?.members.fetch(userName.id));
                    if(!victim) {
                        interaction.reply({content:"Bad user name :/", ephemeral:true});
                        return;
                    }
                    else if(victim.permissions.has('Administrator') || victim.user.id == '614957304667963441') {
                        interaction.reply("Admins/Bots cannot be timed out :/");
                        return;
                    }
                    const user = interaction.user;
                    const banners: Ban[] = await BanService.getBanners();
                    const userCheck = await BanService.banTransaction(user.username);
                    const victimCheck = await BanService.banTransaction(victim.user.username);
                    const check = banners.find(ban => ban.user === user.username)

                    if(check != undefined) {
                        const mult = victimCheck.multiplier;
                        let addedTime = 1 * mult!;
                        victim.timeout( (1+addedTime) * 60 * 1000, 'Pocket Ban!');
                        await interaction.reply(`${DiscordUtils.mentionUser(user.id)} has used their ban to quiet ${DiscordUtils.mentionUser(userName.id)} for a little bit`);

                        let updateVictim: Ban;
                        let updateUser: Ban;
                        if(check.pocketBan) {
                            updateVictim = {
                                user: victim.user.username,
                                multiplier: mult! + 1,
                                pocketBan: true,
                            }

                            updateUser= {
                                user: interaction.user.username,
                                pocketBan: false
                            }

                        } else {
                            updateVictim = {
                                user: victim.user.username,
                                multiplier: mult! + 1,
                            }

                            updateUser= {
                                user: interaction.user.username,
                                oneTime: false
                            }
                        }
                        
                        await BanService.updateBan(updateVictim);
                        await BanService.updateBan(updateUser);
                    } else {
                       await interaction.reply(`You don't have a ban, be good and maybe the leftist mods will give you one`)
                    }
                    break;

                } 
                case 'give': {
                    if(!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)){
                        await interaction.reply(`Nice try, you can't do that`)
                    } else {
                        const type = interaction.options.getString('type');
                        const user = interaction.options.getUser('username');
                        const banCheck = await BanService.getBan(user?.username!);
                        if(banCheck.user && type === 'oneTime') {
                            const update: Ban = {
                                user: user?.username!,
                                oneTime: true
                            }
                            await BanService.updateBan(update)
                        } else if(banCheck.user && type === 'roaming') {
                            const update: Ban = {
                                user: user?.username!,
                                pocketBan: true
                            }
                            await BanService.updateBan(update)
                        } else {
                            if(type === 'oneTime') {
                                const ban: Ban = {
                                    user: user?.username!,
                                    multiplier: 0,
                                    pocketBan: false,
                                    oneTime: true
                                }  
                                await BanService.addBan(ban);
                            } else {
                                const ban: Ban = {
                                    user: user?.username!,
                                    multiplier: 0,
                                    pocketBan: true,
                                    oneTime: false
                                }  
                                await BanService.addBan(ban);
                            }
                        }

                        await interaction.reply(`Congrats ${DiscordUtils.mentionUser(user?.id!)} you have been given a ban! Use it wisely`)
                    }
                    break;
                }
                case 'check': {
                    if (interaction.options.getUser('username') === null) {
                        const holders = await BanService.getBanners();
                        let string ='Here is the list of people who can ban you, it would be wise to stay on their good side:\n'
                        holders.forEach(ban => {
                            if(ban.oneTime) 
                                string += ban.user+' - One-Time\n'
                            else
                                string += ban.user+' - Roaming\n'
                        });
                        interaction.reply(string);
                    } else {
                        const username =interaction.options.getUser('username')?.username!
                        const info = await BanService.getBan(username);
                        if(info.user) {
                            interaction.reply(`${username} has been banned ${info.multiplier} time(s)`)
                        } else {
                            const ban: Ban = {
                                user: username,
                                multiplier: 0,
                                pocketBan: false,
                                oneTime: false
                            }
                            await BanService.addBan(ban);
                            interaction.reply(`${username} has been banned 0 time(s)`)                            
                        }
                    }
                }
            }
        }     
    }
}

export = command;
