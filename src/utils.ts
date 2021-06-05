import Axios, { AxiosResponse } from 'axios';

export default class Utils {
    static thanks: string[] = [
        'https://tenor.com/view/thankyou-aliceinwonderland-gif-9790628',
        'https://tenor.com/view/the-office-bow-michael-scott-steve-carell-office-gif-12985913',
        'https://tenor.com/view/leonardo-dicaprio-thank-you-cheers-smile-gif-17045602',
        'https://tenor.com/view/leopard-tank-tank-attack-gif-15994800',
    ];

    static sad: string[] = [
        'https://tenor.com/view/sad-blackish-anthony-anderson-tears-upset-gif-4988274',
        'https://tenor.com/view/the-office-crying-michael-scott-sad-upset-gif-9816214',
        'https://tenor.com/view/rain-doctorwho-david-tennant-tenth-doctor-sad-gif-5205901',
        "Well that's hurtful :(",
    ];

    static rekt: string[] = [
        'https://tenor.com/view/supa-hot-fire-rekt-burn-popopo-im-not-arapper-gif-4910167',
    ];

    static eightBall: string[] = [
        'Without a doubt.',
        'Outlook good.',
        'Better not tell you now.',
        'Cannot predict now.',
        'My reply is no.',
        'Outlook not so good.',
        'As I see it, yes.',
        'It is certain.',
        'Don’t count on it.',
        'My sources say no.',
        'Very doubtful.',
        'Yes.',
        'No.',
    ];

    static DIGIMOJIS: string[] = [
        '\u0031\u20E3',
        '\u0032\u20E3',
        '\u0033\u20E3',
        '\u0034\u20E3',
        '\u0035\u20E3',
        '\u0036\u20E3',
        '\u0037\u20E3',
        '\u0038\u20E3',
        '\u0039\u20E3',
    ];

    static excludedChannels: string[] = [
        '228322496955416576',
    ];

    static twss: string[] = [
        'https://tenor.com/view/michaelscott-theoffice-thats-what-she-said-gif-4084628',
        'https://tenor.com/view/thats-what-she-said-michael-scott-smile-shrug-thats-all-gif-16786963',
        'https://tenor.com/view/thats-what-she-said-inside-joke-memes-eyebrow-raise-you-know-what-imean-gif-15770443',
        'https://tenor.com/view/thatswhatshesaid-michaelscott-theoffice-thatswhatshe-thatswhat-gif-9531422',

    ];

    static channelIds: Map<string, string> = new Map([
        [ 'general', '105814173388156928' ],
        [ 'aint-played-nobody-pawl', '614897075095732258' ],
        [ 'test', '614956907894931478' ],
    ]);

    public static getCurrentDate (): string {
        const today = new Date();
        const dd = today.getDate().toString().padStart(2, '0');
        const mm = (today.getMonth() + 1).toString().padStart(2, '0'); // January is 0!
        return `${mm}/${dd}`;
    }

    public static async getURL (url: string): Promise<AxiosResponse> {
        let response: AxiosResponse;
        try {
            response = await Axios.get(url);
        } catch (e) {
            console.log(e);
        }
        return response;
    }

    public static async postURL (url: string, data: any): Promise<AxiosResponse> {
        let response: AxiosResponse;
        try {
            response = await Axios.post(url, data);
        } catch (e) {
            //console.log(e);
        }
        return response;
    }

    public static async getURLAuth (url: string): Promise<string> {
        let response;
        try {
            response = await Axios.get(url, {
                auth: {
                    username: process.env.USER_NAME,
                    password: process.env.PASSWORD,
                },
            });
        } catch (e) {
            console.log(e);
        }
        return response.data;
    }

    public static async postURLAuth (url: string): Promise<string> {
        let response;
        try {
            response = await Axios.post(url, {}, {
                auth: {
                    username: process.env.USER_NAME,
                    password: process.env.PASSWORD,
                },
            });
        } catch (e) {
            console.log(e);
        }
        return response.data;
    }
}
