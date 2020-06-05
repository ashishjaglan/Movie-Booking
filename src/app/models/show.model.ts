export interface Show{
    id: string;
    sourceId: string;
    theatreData: string;
    hallId: string;
    startTime: Date;
    endTime: Date;
    price: number;
    seatsAvailable: number;
    seats: number[];
    cols: number;
}