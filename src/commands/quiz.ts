import { ActionRowBuilder, CollectorFilter, ComponentType, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import { Command } from "../interfaces/command.interface";
import QuizService from "../services/quiz.service";
const command: Command = {
    data: new SlashCommandBuilder()
    .setName('acroquiz')
    .setDescription(`take a quiz with random questions`)
    .addIntegerOption(option => 
        option.setName('number')
        .setDescription('number of questions you want')
        .setRequired(false))
    .addStringOption(option => 
        option.setName('category')
        .setDescription('category for the questions leave blank for ')
        .addChoices(
            {
                name: "Any",
                value: "1"
            },
            {
                name: "General Knowlege",
                value: "9"
            },
            {
                name: "Entertainment: Books",
                value: "10"
            },
            {
                name: "Entertainment: Film",
                value: "11"
            },
            {
                name: "Entertainment: Music",
                value: "12"
            },
            {
                name: "Entertainment: Television",
                value: "14"
            },
            {
                name: "Entertainment: Video Games",
                value: "15"
            },
            {
                name: "Entertainment: Board Games",
                value: "16"
            },
            {
                name: "Sports",
                value: "21"
            },
            {
                name: "Vehicles",
                value: "28"
            },
            {
                name: "Entertainment: Anime",
                value: "31"
            },
            {
                name: "Entertainment Cartoons",
                value: "32"
            }
            
        )),
    run: async (interaction) =>  {
        if(interaction.isChatInputCommand()) {
            const numberOfQuestions = interaction.options.getInteger('number') || 1;
            const category = interaction.options.getString('category');
            const questions = await QuizService.questionHandler(numberOfQuestions,category);
            let correctAnswers: number = 0;
            const questionResults: boolean[] =[];
            await interaction.deferReply();
            await interaction.editReply(' You have 30 seconds to answer each question....Get Ready!!!');
            await new Promise(f => setTimeout(f, 3000));

            for (const question of questions) {
                let breakLoop: boolean = false;
                const actionRow: ActionRowBuilder<StringSelectMenuBuilder> = await QuizService.selectMenuBuilder(question);
                await interaction.editReply({content: `${question.question}\n`, components: [actionRow]});

                const filter: CollectorFilter<any> = async i =>{
                    return i.customId === question.answer && i.user.id === interaction.user.id;
                }

               await interaction.channel?.awaitMessageComponent({filter, componentType: ComponentType.StringSelect, time: .3 * 60 * 1000})
               .then(async (answerInt) => {
                    actionRow.components[0].setDisabled(true);
                    if(answerInt.values[0] === question.answer) {
                        interaction.editReply({content: 'Thats Correct!', components: [actionRow]});
                        ++correctAnswers;
                        questionResults.push(true);
                    } else {
                        interaction.editReply({content: 'Thats Wrong!', components:[actionRow]});
                        questionResults.push(false);
                    }
                    answerInt.deferUpdate();
                    await new Promise(f => setTimeout(f, 3000));
               }).
               catch(err => {
                    breakLoop = true;
                    actionRow.components[0].setDisabled(true);
                    interaction.editReply({content: 'You didnt answer in time stopping the quiz', components: [actionRow]});
                })

                if(breakLoop)
                    break;

            }
            let percent = Math.round((correctAnswers/questions.length) * 100);
            let resultString = `You got ${correctAnswers} right which is a ${percent.toString()}%`

            const embed = QuizService.quizResults(questions, questionResults)
            .setDescription(resultString)

            interaction.followUp({content: `Thanks for taking my quiz! is your report card:`, embeds:[embed]});
        }
    }
}

export = command;