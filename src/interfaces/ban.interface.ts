export interface Ban {
    user: string;
    multiplier?: number;
    pocketBan?: boolean;
    oneTime?: boolean;
}