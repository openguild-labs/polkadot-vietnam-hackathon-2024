import { Test, TestingModule } from '@nestjs/testing';
import { PairService } from './pair.service';

describe('PairService', () => {
  let service: PairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PairService],
    }).compile();

    service = module.get<PairService>(PairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
