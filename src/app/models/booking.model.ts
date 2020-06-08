export interface Booking{
    id: string;
    showId: string;
    userId: string;
    bookedSeats: number[];
    totalPayment: number;
    timeStamp: Date;
}
