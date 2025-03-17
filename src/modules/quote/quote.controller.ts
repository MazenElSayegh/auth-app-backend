import { Controller, Get, UseGuards } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Get('random')
  getRandomQuote() {
    return this.quoteService.getRandomQuote();
  }
}
