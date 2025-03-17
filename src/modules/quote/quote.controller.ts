import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { QuoteService } from './quote.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Quotes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @ApiOperation({ summary: 'Get a random quote' })
  @ApiResponse({ status: 200, description: 'Returns a random quote' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('random')
  getRandomQuote() {
    return this.quoteService.getRandomQuote();
  }
}
