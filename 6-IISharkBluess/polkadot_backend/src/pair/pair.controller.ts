import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PairService } from './pair.service';
import { ApiTags } from '@nestjs/swagger';
import { createPairDto } from './dto/pair.dto';
import { ResponseMessage } from 'src/utils/ResMessage.utils';

@ApiTags('Pair')
@Controller('v1')
export class PairController {
  constructor(private readonly pairService: PairService) {}

  @Post('pair')
  async createPairToken(@Body() data: createPairDto) {
    const new_pair = await this.pairService.createPairToken(data);

    return new ResponseMessage(200, 'Create new pair successfully', new_pair);
  }

  @Get('pairs')
  async getAllPair() {
    const pairList = await this.pairService.getAllPair();
    return new ResponseMessage(200, 'Fetch pair list successfully', pairList);
  }

  @Get('pair/:pairId')
  async getPair(@Param('pairId') pairId: string) {
    const pair = await this.pairService.getPair(pairId);

    return new ResponseMessage(200, 'Fetch pair successfully', pair);
  }

  @Patch('pair/:pairId')
  async updatePair(
    @Param('pairId') pairId: string,
    @Body() data: createPairDto,
  ) {
    const updatedPair = await this.pairService.updatePairToken(pairId, data);
    return new ResponseMessage(200, 'Update pair successfully', updatedPair);
  }

  @Delete('pair/:pairId')
  async deletePair(@Param('pairId') pairId: string) {
    const deletedPair = await this.pairService.deletePair(pairId);

    return new ResponseMessage(200, 'Update pair successfully', deletedPair);
  }
}
