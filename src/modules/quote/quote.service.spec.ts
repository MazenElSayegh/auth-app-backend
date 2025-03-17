import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';
import { CommonHelper } from '../../common/common.helper';
import { QuotesConstants } from '../../common/constants/quote.constants';

jest.mock('../../common/common.helper', () => ({
  CommonHelper: {
    getRandomValue: jest.fn(),
  },
}));

describe('QuoteService', () => {
  let service: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteService],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('QuoteService', () => {
    it('should return a random quote', () => {
      jest.spyOn(CommonHelper, 'getRandomValue').mockReturnValue(1);
      const result = service.getRandomQuote();
      expect(result).toEqual({ quote: QuotesConstants[1] });
      expect(CommonHelper.getRandomValue).toHaveBeenCalledWith(
        0,
        QuotesConstants.length - 1,
      );
    });
  });
});
