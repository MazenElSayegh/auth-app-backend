import { Injectable } from '@nestjs/common';
import { CommonHelper } from 'src/common/common.helper';
import { QuotesConstants } from 'src/common/constants/quote.constants';

@Injectable()
export class QuoteService {
  getRandomQuote() {
    const index = CommonHelper.getRandomValue(0, QuotesConstants.length);
    return { quote: QuotesConstants[index] };
  }
}
