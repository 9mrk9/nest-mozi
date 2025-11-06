import * as fs from 'fs/promises';
import { Booking } from './types';

export async function checkOrCreateFolder(path: string): Promise<void> {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path, { recursive: true });
  }
}

export async function loadBookings(path: string): Promise<Booking[]> {
  try {
    await fs.access(path);
  } catch {
    return [];
  }
  try {
    const data = await fs.readFile(path, 'utf-8');
    const allLines = data.split(/\r?\n/).filter((line) => line.trim() !== '');

    if (allLines.length === 0) return [];

    const headerParts = allLines[0].split(',');
    const lines = allLines.slice(1);

    return lines.map((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length !== headerParts.length) {
        throw new Error('Invalid booking data');
      }

      return {
        id: Number(parts[0]),
        movie: parts[1],
        name: parts[2],
        email: parts[3],
        date: new Date(parts[4]),
        peopleCount: Number(parts[5]),
      } as Booking;
    });
  } catch (error) {
    throw new Error(
      'Hiba a foglalások betöltésekor: ' + (error as Error).message,
    );
  }
}

export async function addBooking(
  path: string,
  booking: Booking,
  isFirst: boolean = false,
): Promise<void> {
  try {
    if (isFirst) {
      const header = 'id,movie,name,email,date,peopleCount\n';
      await fs.appendFile(path, header, 'utf-8');
    }
    const date = new Date(booking.date);
    date.setSeconds(0, 0);
    const line = `${booking.id},${booking.movie},${booking.name},${booking.email},${date.toISOString()},${booking.peopleCount}\n`;
    await fs.appendFile(path, line, 'utf-8');
  } catch {
    throw new Error('Hiba a foglalás hozzáadása során! Kérjük, próbáld újra. ');
  }
}
