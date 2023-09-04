import { Car } from '../interfaces/car.interface';
import Utils from '../utils';

export default class CarService {
    public static async checkCar (car: Car): Promise<{_id: any}> {
        let response;
        try {
            response = await Utils.getURLWithData(`${process.env.ACRO_API}/cars/check`, car);
        } catch(e) {
            console.log(e)
        }

        return response?.data
    }

    public static async addCar (car: Car): Promise<string> {
        let response;
        try {
            response = await Utils.postURL(`${process.env.ACRO_API}/cars/create`, car);
        } catch(e) {
            console.log(e)
        }

        return response?.data.message
    }

    public static async removeCar (car: Car): Promise<string> {
        let response;
        try {
            response = await Utils.deleteURL(`${process.env.ACRO_API}/cars/delete`, car);
        } catch(e) {
            console.log(e)
        }

        return response?.data.message
    }

    public static async updateCar (car: Car): Promise<string> {
        let response;
        try {
            response = await Utils.postURL(`${process.env.ACRO_API}/cars/update`, car);
        } catch(e) {
            console.log(e)
        }

        return response?.data.message
    }

    public static async getAll (): Promise<Car[]> {
        let response;
        try {
            response = await Utils.getURL(`${process.env.ACRO_API}/cars/all`);
        } catch(e) {
            console.log(e)
        }

        return response?.data
    }

    public static async find (owner: string): Promise<Car[]> {
        let response;
        try {
            response = await Utils.getURL(`${process.env.ACRO_API}/cars/find/${owner}`);
        } catch(e) {
            console.log(e)
        }

        return response?.data
    }
}