import { CronJob } from "cron";
import { Ban } from "../interfaces/ban.interface";
import Utils from "../utils";

export default class BanService {
    banJob: CronJob;

    constructor() {
        this.banJob = new CronJob('0 0 8 1 * *', () => {
            BanService.resetMult();
        }, null, true, 'America/Chicago');
    }

    public startJob (): void {
        this.banJob.start();
    }

    public static async addBan(ban: Ban) {
        let response;
        try {
            response = await Utils.postURL(`${process.env.ACRO_API}/bans`, ban);
        } catch(e) {
            console.log(e);
        }

        return response?.data;
    }

    public static async getBan(user: string): Promise<Ban> {
        let response;
        try {
            response = await Utils.getURL(`${process.env.ACRO_API}/bans/${user}`);
        } catch(e) {
            console.log(e);
        }

        return response?.data;
    }

    public static async updateBan(ban: Ban) {
        let response;
        try {
            response = await Utils.patchURLWithData(`${process.env.ACRO_API}/bans/${ban.user}`, ban);
        } catch(e) {
            console.log(e);
        }

        return response?.data.message;
    }

    public static async resetMult() {
        let response;
        try {
            response = await Utils.patchURL(`${process.env.ACRO_API}/bans`);
        } catch(e) {
            console.log(e);
        }
        const updateMe : Ban ={
            user: 'di3in4hol3',
            oneTime: true

        }
        const updatePelle : Ban ={
            user: 'jpelle420',
            oneTime: true

        }
        await BanService.updateBan(updateMe)
        await BanService.updateBan(updatePelle)
    }

    public static async getBanners(): Promise<Ban[]> {
        let response;
        try {
            response = await Utils.getURL(`${process.env.ACRO_API}/bans/banner`);
        } catch(e) {
            console.log(e);
        }

        return response?.data;
    }

    public static async banTransaction(user: string): Promise<Ban> {
        const checkBan = await this.getBan(user);
        if (!checkBan) {
            const add: Ban = {
                user: user,
                multiplier: 0,
                pocketBan: false,
                oneTime: false
            }
            return this.addBan(add);
        }

        return checkBan
    }

}