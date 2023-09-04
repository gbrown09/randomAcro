import Utils from '../utils';

export default class AcroService {
    static phrases: string[] = ["I'm pretty sure it means", "It's obviously", "It for sure means", "That stands for"];

    constructor() {}


    public static async getAcro(acronym: string): Promise<string> {
        let wordList: string [] =[]
        let letters = acronym.replace(/[^a-zA-Z ]/g, "")
        letters = letters.replace(/\s/g, "");
        for (let i=0; i < letters.split("").length; i++) {
            wordList.push(await this.getWord(letters[i].toLowerCase()))
        }
        let words = wordList.join(" ");
        var index = Math.floor(Math.random() * this.phrases.length);

        return `${this.phrases[index]} ${words}`

    }

    private static async getWord(letter: string): Promise<string> {
        let URL = `https://random-word-api.vercel.app/api?words=1&letter=${letter}&type=capitalized`
        const response = await Utils.getURL(URL)
        return response?.data

    }
}