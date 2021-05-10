import * as dotenv from 'dotenv';
import { resolve } from "path";
import { RandomAcro } from './src/bot';

async function sendit(){
    console.log('env',process.env.NODE_ENV);
    dotenv.config({
        path: process.env.NODE_ENV
        ? resolve(__dirname, `../environment/${process.env.NODE_ENV}.env`)
        : resolve(__dirname, 'environment/dev.env')
    });

    new RandomAcro();
}

sendit();