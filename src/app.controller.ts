import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import CreateBookingDto from './dto/create-booking.dto';
import type { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  get() {}

  @Post('booking')
  async create(@Body() bookingRequest: CreateBookingDto, @Res() res: Response) {
    const result = await this.appService.addBooking(bookingRequest);

    if ('errors' in result || 'message' in result) {
      return res.status(400).render('index', {
        errors: result.errors,
        message: result.message,
        rewritePath: '/',
      });
    }
    return res
      .status(201)
      .render('success', { booking: result, rewritePath: '/success' });
  }
}
