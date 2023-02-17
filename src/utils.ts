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

    static riot: string [] = [
        'https://tenor.com/bBtE0.gif',
        'https://tenor.com/bFbMD.gif',
        'https://tenor.com/Xjjn.gif',
        'https://tenor.com/bTQ5q.gif',
        'https://tenor.com/SfuL.gif',
    ]

    static copyPasta: string[] = [
        `Which is funny because there is definitely literature out there that described finding SARS-COV-2 in penile tissue and linking that to ED`,
        `Oh boy. When I was a kid we were stationed in Germany where that song was popular. Eventually about the time I was in middle school we got moved to Texas. Playing in my room one night while listening to the radio that song popped into my head. I tried to call into the radio station I was listening to to request that song, and although I got on the air, the DJ had no fucking clue what song I was trying to describe`,
        `Can I just say that Olivia Rodrigo has no business being that hot AND that sad at the same time`,
        `Add in some apple cider vinegar, whish to emulsify, wham bam thank you ma'am pan sauce`,
        `I heard they've got a BOGO on pig farmers right now`,
        `Also, if we didn't have to change out and recharge the batteries in all the cancer birds this wouldn't even be an issue`,
        `Is this your house? Could he perhaps know that you have a pretty snazzy costume? Could he perhaps not be trying to prove to you he IS worthy of borrowing one of your snazzy costumes?`,
        `Do you, by any chance, have both coriander seeds/ground and citra hops at home?`,
        `I think it's the types of people that come into the bar and order white claws that posted this on their insta`,
        `"The Gang Funnels Goody Powder Into Their Ass"`,
        `Capsaicinoids are hydrophobic. In other words, they are more soluble in alcohol or fat than they are in water. This means that a sauce made solely from peppers, water, and salt may tend to have more of an overall bite than the same sauce that has fat or oil blended into it instead of water; we might perceive the fat-free version having a harsher heat, while the fat-enriched one might carry a more moderate spice level`,
        `Unfortunately our current wars are the consequences of our own actions several decades ago. It won't be as simple as walking away to spend less. Doing so will create a vacuum to be filled immediately by China and/or Russia who are already operating in those spaces anyway and were a portion of the original problem anyway. I think our best bet to solving these problems right now is to hold strong, make no change in either direction while looking inwards to square ourselves away first.`,
        `Spending is.. difficult. I'm all for spending if it's on the right things. I don't mind spending a few dollars so my neighbor can make it to the doctor or to help her weather being laid off. This relies on our elected officials to have a bit of integrity which is apparently lacking these days. Everyone likes to take the money and run. So, that said, an innovative stance would not be to simply want to spend less. It would be to evaluate what is being purchased--are our paid services being enacted? Are we shortchanging ourselves by relying on shoddy work from the lowest bidder in the endeavor to spend less? Is just paying people's bills as effective as directly employing them temporarily instead? So on so forth. We tend to outright ignore incrementalism which is where I think we'll find in years to come that we can make the greatest strides in shrinking government and spending less`,
        `I know we all like to joke that "adulting" is doing your taxes etc etc but nah. True "adulting" is having to sit your bonafide asshole of a dog down and have a discussion about not fucking up the mulch you just laid down because you're the one who has a job and has to pay for it and it's their fault you have to even do this in the first place because someone has no respect for either landscaping or hard work`,
        `Another thing about the DoD adoption of MS Teams is that outlook kills all emailed links so if someone emails a "join meeting" link it's dead on arrival. All these good ideas that are halfway thought through at best. I swear..`,
        `Which makes it funny that it would be experienced as hitting harder because to generate that humoral immunity clonal selection has already occurred. I don't know off the top of my head if clonal selection and initial expansion is more or less resource intensive than memory expansion. But that also relies on resource intensiveness being a major driver of malaise and not just inflammation`,
        `I fucking hate proline so fucking much it's the worst amino acid it's so fucking stupid it's incapable of being fucking normal so it forms an ugly ass ring with itself with its own fucking nitrogen cuz it's a loser fucking amino acid I hate it so much I'd rather cut off my right tit than have to ever draw a mechanism with proline ever again`

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
        let response!: AxiosResponse;
        try {
            response = await Axios.get(url);
        } catch (e) {
            console.log(e);
        }
        return response;
    }

    public static async postURL (url: string, data: any): Promise<AxiosResponse> {
        let response!: AxiosResponse;
        try {
            response = await Axios.post(url, data);
        } catch (e) {
            //console.log(e);
        }
        return response;
    }

    public static async getURLAuth (url: string): Promise<string> {
        let response!: AxiosResponse;
        try {
            response = await Axios.get(url, {
                auth: {
                    username: process.env.USER_NAME || '',
                    password: process.env.PASSWORD || '',
                },
            });
        } catch (e) {
            console.log(e);
        }
        return response.data;
    }

    public static async postURLAuth (url: string): Promise<string> {
        let response!: AxiosResponse;
        try {
            response = await Axios.post(url, {}, {
                auth: {
                    username: process.env.USER_NAME || '',
                    password: process.env.PASSWORD || '',
                },
            });
        } catch (e) {
            console.log(e);
        }
        return response.data;
    }
}
