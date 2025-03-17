import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { AuthGuard } from '@nestjs/passport';

describe('QuoteController', () => {
  let controller: QuoteController;
  let quoteService: QuoteService;

  beforeEach(async () => {
    const mockAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const mockQuoteService = {
      getRandomQuote: jest
        .fn()
        .mockReturnValue({ text: 'Sample Quote', author: 'Author' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [{ provide: QuoteService, useValue: mockQuoteService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<QuoteController>(QuoteController);
    quoteService = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a random quote', async () => {
    const result = { text: 'Sample Quote', author: 'Author' };
    expect(await controller.getRandomQuote()).toEqual(result);
    expect(quoteService.getRandomQuote).toHaveBeenCalled();
  });
});
