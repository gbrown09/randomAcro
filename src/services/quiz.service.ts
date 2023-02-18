import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "@discordjs/builders";
import { AxiosResponse } from "axios";
import { EmbedBuilder } from "discord.js";
import { get } from "node-emoji";
import { Question } from "../interfaces/question.interface";
import Utils from "../utils";

export default class QuizService {
    static quizApi = `https://opentdb.com/api.php?encode=url3986`;
    
    static yes = get('white_check_mark');

    static no = get('x');

    static token: string;

    static async getQuestion(numberOfQuestions: string, category: string| null): Promise<AxiosResponse> {
        let url = `${this.quizApi}&amount=${numberOfQuestions}`
        if(category && category !== '1'){
             url += `&category=${category}`
        }

        let firstTry =  url + `&token=${this.token}`
        let response = await Utils.getURL(encodeURI(firstTry))
        if(response.data.response_code === 3) {
            const tokenResponse = await Utils.getURL(encodeURI(`https://opentdb.com/api_token.php?command=request`))
            this.token = tokenResponse.data.token
            let secondTry =  url + `&token=${this.token}`
            response = await Utils.getURL(encodeURI(secondTry))
        }
        
        return (response)
    }

    static buildQuizMenu() {
        const quizMenu = new ActionRowBuilder<StringSelectMenuBuilder>();
    
        quizMenu.addComponents(
            new StringSelectMenuBuilder()
        )        
    }

    static async questionHandler(numberOfQuestions: number, category: string | null) {
        const apiResponse = await this.getQuestion(numberOfQuestions.toString(), category);
        const questionList: Question[] = []

        apiResponse.data.results.forEach((question: any) => {
            let dto = this.questionDto(question)

            questionList.push(dto);
        });

        return questionList;
    }

    static choiceBuilder(question: Question)  {
        const menuOptions: StringSelectMenuOptionBuilder[] = []; 

        question.choices.forEach(choice => {
            const builder = new StringSelectMenuOptionBuilder();
            choice = decodeURIComponent(choice);
        
            builder.setLabel(choice);
            builder.setValue(choice);

            menuOptions.push(builder);
        });

        return this.shuffleChoices(menuOptions);        
    }

    static shuffleChoices(choices: StringSelectMenuOptionBuilder[]): StringSelectMenuOptionBuilder[] {
        let currentIndex = choices.length, randomIndex:number;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [choices[currentIndex], choices[randomIndex]] = [ choices[randomIndex], choices[currentIndex] ]
        }

        return choices;
    }

    static async selectMenuBuilder (question: Question) {

        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
        const menu = new StringSelectMenuBuilder();

        const test = this.choiceBuilder(question);
        menu.addOptions(test);
        menu.setCustomId(question.answer)
        menu.setPlaceholder('Select an Answer');

        actionRow.addComponents(menu)

        return actionRow;
    }

    static quizResults(questionsList: Question[], correct: boolean[]): EmbedBuilder {
        let questions = ''
        let answers = ''
        let right =''
        let i = 0;
        questionsList.forEach((question ,index) => {
            questions += `-${question.question}\n\n`
            answers += `${question.answer}\n\n`
            if(correct[index])
                right += `${this.yes}\n\n`
            else if(!correct[index])
                right += `${this.no}\n\n`

        })
        const embed = new EmbedBuilder()
            .setTitle('Report card:')
            .setColor('#00AE86')
            .addFields({name:`Questions`, value: questions, inline: true})
            .addFields({name:`Correct Answers`, value: answers, inline: true})
            .addFields({name:`Right/Wrong`, value: right, inline: true});
        return embed;
    }

    private static questionDto(data:any): Question {
        const question: Question = {
            question: decodeURIComponent(data.question),
            answer: decodeURIComponent(data.correct_answer),
            choices: data.incorrect_answers
        }
        question.choices.push(question.answer);

        return question;
    }
    
}
