import { BadRequestException } from '@nestjs/common';

export default class CreateBookingDto {
  name: string;
  movie: string;
  email: string;
  date: string;
  peopleCount: string;
}

export function validateName(name: string): string {
  if (name.trim().length === 0) {
    throw new BadRequestException('A név nem lehet üres');
  }
  return name;
}

export function validateMovie(movie: string): string {
  if (movie.trim().length === 0) {
    throw new BadRequestException('A film címe nem lehet üres');
  }
  return movie;
}

export function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException('Érvénytelen email formátum');
  }
  return email;
}

export function validateDate(date: string): Date {
  const bookingDate = new Date(date);
  if (isNaN(bookingDate.getTime())) {
    throw new BadRequestException('Érvénytelen dátum formátum');
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new BadRequestException('Érvénytelen foglalási dátum');
  }
  return bookingDate;
}

export function validatePeopleCount(peopleCount: string): number {
  const count = Number(peopleCount);
  if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
    throw new BadRequestException(
      'A nézők számának pozitív egész számnak kell lennie',
    );
  }
  return count;
}
