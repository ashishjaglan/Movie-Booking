export interface History{
    id: string;
    bookingId: string;
    userId: string;
    sourceName: string;
    imagePath: string;
    startTime: Date;
    theatreName: string;
    hallName: string;
    bookedSeats: string[];
    totalPayment: number;
    timeStamp: Date;
}
