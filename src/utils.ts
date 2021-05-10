export class Utils {
    static thanks: string[] = [
        'https://tenor.com/view/thankyou-aliceinwonderland-gif-9790628',
        'https://tenor.com/view/the-office-bow-michael-scott-steve-carell-office-gif-12985913',
        'https://tenor.com/view/leonardo-dicaprio-thank-you-cheers-smile-gif-17045602',
        'https://tenor.com/view/leopard-tank-tank-attack-gif-15994800'
    ]

    static sad: string[] = [
        'https://tenor.com/view/sad-blackish-anthony-anderson-tears-upset-gif-4988274',
        'https://tenor.com/view/the-office-crying-michael-scott-sad-upset-gif-9816214',
        'https://tenor.com/view/rain-doctorwho-david-tennant-tenth-doctor-sad-gif-5205901',
        "Well that's hurtful :("
    ]

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
        'No.'
    ]

    static DIGIMOJIS: string[] = [
        "\u0031\u20E3",
        "\u0032\u20E3",
        "\u0033\u20E3",
        "\u0034\u20E3",
        "\u0035\u20E3",
        "\u0036\u20E3",
        "\u0037\u20E3",
        "\u0038\u20E3",
        "\u0039\u20E3",
      ]

      static excludedChannels: string[] = [
        '228322496955416576'
      ]

      static channelIds: Map<string,string> = new Map ([
        ['general', '614956907894931478'],
        ['aint-played-nobody-pawl', '614897075095732258']
    ]);


      public static getCurrentDate(): string{
        var today = new Date();
        var dd = today.getDate().toString().padStart(2, '0');
        var mm = (today.getMonth() + 1).toString().padStart(2, '0'); //January is 0!
        return mm + dd;
        
      }
}