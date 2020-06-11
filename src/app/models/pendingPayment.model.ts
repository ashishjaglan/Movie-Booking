export interface PendingPayment{
    id: string;
    showId: string;
    showName: string;
    userId: string;
    bookedSeats: number[];
    totalPayment: number;
    timeStamp: Date;
}
