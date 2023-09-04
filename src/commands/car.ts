import { SlashCommandBuilder } from 'discord.js';
import DiscordUtils from '../discordUtils';
import { Car } from '../interfaces/car.interface';
import { Command } from '../interfaces/command.interface';
import CarService from '../services/car.service';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('car')
        .setDescription('Car Command for the lair')
        .addSubcommand(subcommand => 
            subcommand.setName('add')
            .setDescription('Add your car to the list')
            .addNumberOption(option => 
                option.setName('year')
                .setDescription('Year')
                .setRequired(true))
            .addStringOption(option => 
                option.setName('make')
                .setDescription('Make')
                .setRequired(true))
            .addStringOption(option => 
                option.setName('model')
                .setDescription('Model')
                .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('delete')
            .setDescription('Delete your car from the list')
            .addNumberOption(option => 
                option.setName('year')
                .setDescription('Year')
                .setRequired(true))
            .addStringOption(option => 
                option.setName('make')
                .setDescription('Make')
                .setRequired(true))
            .addStringOption(option => 
                option.setName('model')
                .setDescription('Model')
                .setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand.setName('list')
            .setDescription('Get the list of Cars'))
        .addSubcommand(subcommand => 
            subcommand.setName('find')
            .setDescription('What car(s) does someone have')
            .addUserOption(option =>
                option.setName('username')
                .setDescription('username to look for')
                .setRequired(true))),
    run: async (interaction) => {

        if(interaction.isChatInputCommand()) {
            switch(interaction.options.getSubcommand()) {
                case 'add': {
                    const carDto: Car = {
                        owner: interaction.user.username,
                        year: interaction.options.getNumber('year')!,
                        make: interaction.options.getString('make')!,
                        model: interaction.options.getString('model')!
                    }

                    if(await CarService.checkCar(carDto) === null){
                        const reply = await CarService.addCar(carDto);
                        await interaction.reply({content: reply, ephemeral: true})
                    } else {
                        await interaction.reply({content: 'Car already exists', ephemeral:true})
                    }
                    break;
                }
                case 'list' : {
                    const list = await CarService.getAll();
                    const reply = await DiscordUtils.carStringBuilder(list);
                    await interaction.reply(reply);
                    break;
                }
                case 'delete' : {
                    const carDto: Car = {
                        owner: interaction.user.username,
                        year: interaction.options.getNumber('year')!,
                        make: interaction.options.getString('make')!,
                        model: interaction.options.getString('model')!
                    };

                    if(await CarService.checkCar(carDto) !== null){
                        const reply = await CarService.removeCar(carDto);
                        await interaction.reply({content: reply, ephemeral: true})
                    } else {
                        await interaction.reply({content: `Car doesn't exist`, ephemeral: true});
                    }
                    break;
                }
                case 'find' : {
                    const username = interaction.options.getUser('username')?.username!
                    const carList = await CarService.find(username)
                    let ecoString = '';
                    if(carList.length > 0) {
                        ecoString = `${username} has ${carList.length} car(s):\n`
                        carList.forEach( (car: Car) => {
                            ecoString += `${car.year} ${car.make} ${car.model}\n`
                        });
                    } else {
                        ecoString = `No cars that I know of`
                    } 
                    await interaction.reply(ecoString);
                    break;
                }

            }
        }
    }
}

export = command;
