import CreateBookingDto from '../dto/create-booking.dto';

export type Booking = {
  id: number;
  movie: string;
  name: string;
  email: string;
  date: Date;
  peopleCount: number;
};

export type ValidationResult = {
  message?: string;
  errors?: {
    [key in keyof CreateBookingDto]?: string;
  };
};
