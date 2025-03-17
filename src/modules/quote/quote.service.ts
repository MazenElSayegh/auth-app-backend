import { Injectable } from '@nestjs/common';
import { CommonHelper } from '../../common/common.helper';
import { QuotesConstants } from '../../common/constants/quote.constants';

@Injectable()
export class QuoteService {
  getRandomQuote() {
    const index = CommonHelper.getRandomValue(0, QuotesConstants.length - 1);
    return { quote: QuotesConstants[index] };
  }
}
