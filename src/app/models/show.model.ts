export interface Show{
    id: string;
    sourceId: string;
    theatreData: string;
    hallId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    seatsAvailable: number;
    seats: number[];
    cols: number;
}