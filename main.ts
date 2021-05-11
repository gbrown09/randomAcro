import { config } from 'dotenv';
import RandomAcro from './src/bot';
import { resolve } from 'path';

async function sendit () {
    console.log('env', process.env.NODE_ENV);
    config({
        path: process.env.NODE_ENV
            ? resolve(__dirname, `../environment/${process.env.NODE_ENV}.env`)
            : resolve(__dirname, 'environment/dev.env'),
    });

    new RandomAcro();
}

sendit();
