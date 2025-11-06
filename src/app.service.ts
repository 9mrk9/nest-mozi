import { Injectable, OnModuleInit } from '@nestjs/common';
import { Booking, ValidationResult } from './lib/types';
import { bookingsPath } from './lib/constants';
import { addBooking, loadBookings } from './lib/scripts';
import CreateBookingDto, {
  validateDate,
  validateEmail,
  validateMovie,
  validateName,
  validatePeopleCount,
} from './dto/create-booking.dto';

@Injectable()
export class AppService implements OnModuleInit {
  bookings: Booking[] = [];
  constructor() {}
  async onModuleInit() {
    this.bookings = await loadBookings(bookingsPath);
  }

  getNextBookingId(): number {
    if (this.bookings.length === 0) return 1;
    return this.bookings.at(-1)!.id + 1;
  }

  async addBooking(
    booking: CreateBookingDto,
  ): Promise<Booking | ValidationResult> {
    const { movie, name, email, date, peopleCount } = booking;
    const validationResponse: ValidationResult = {};

    const newBooking: Booking = {
      id: this.getNextBookingId(),
      movie: '',
      name: '',
      email: '',
      date: new Date(),
      peopleCount: 0,
    };
    try {
      newBooking.movie = validateMovie(movie);
    } catch (error) {
      validationResponse.errors = {
        ...validationResponse.errors,
        movie: (error as Error).message,
      };
    }

    try {
      newBooking.name = validateName(name);
    } catch (error) {
      validationResponse.errors = {
        ...validationResponse.errors,
        name: (error as Error).message,
      };
    }

    try {
      newBooking.email = validateEmail(email);
    } catch (error) {
      validationResponse.errors = {
        ...validationResponse.errors,
        email: (error as Error).message,
      };
    }

    try {
      newBooking.date = validateDate(date);
    } catch (error) {
      validationResponse.errors = {
        ...validationResponse.errors,
        date: (error as Error).message,
      };
    }

    try {
      newBooking.peopleCount = validatePeopleCount(peopleCount);
    } catch (error) {
      validationResponse.errors = {
        ...validationResponse.errors,
        peopleCount: (error as Error).message,
      };
    }

    if (validationResponse.errors || validationResponse.message) {
      return validationResponse;
    }
    try {
      await addBooking(bookingsPath, newBooking, newBooking.id === 1);
      this.bookings.push(newBooking);
      return newBooking;
    } catch (error) {
      validationResponse.message = (error as Error).message;
      return validationResponse;
    }
  }
}
