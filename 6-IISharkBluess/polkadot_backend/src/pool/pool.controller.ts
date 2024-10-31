import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PoolService } from './pool.service';
import { createPoolDto } from './dto/pool.dto';
import { ResponseMessage } from 'src/utils/ResMessage.utils';
import { UserService } from 'src/user/user.service';

@ApiTags('Pool')
@Controller('v1')
export class PoolController {
  constructor(
    private readonly poolService: PoolService,
    private readonly userService: UserService,
  ) {}

  @Post('pool')
  async createPool(@Body() body: createPoolDto) {
    const pool = await this.poolService.createPool(body);
    // const user = await this.userService.getAccountByAddress(body.creator);
    // const user_pool = await this.poolService.createUserPool(user.id, pool.id);
    return new ResponseMessage(200, 'Create pool successfully', pool);
  }

  @Get('pools')
  async getAllPool() {
    const poolList = await this.poolService.getAllPool();

    return new ResponseMessage(200, 'Get all pool successfully', poolList);
  }

  @Get('pool/:poolId')
  async getPool(@Param('poolId') poolId: string) {
    const pool = await this.poolService.getPool(poolId);

    return new ResponseMessage(200, 'Get pool successfully', pool);
  }

  @Patch('pool/:poolId')
  async updatePool(@Param('poolId') poolId: string, @Body() profit: number) {
    return new ResponseMessage(
      200,
      'Update pool successfully',
      await this.poolService.updatePool(poolId, profit),
    );
  }

  @Delete('pool/:poolId')
  async cancelPool(@Param('poolId') poolId: string) {
    return new ResponseMessage(
      200,
      'Cancel pool successfully',
      await this.poolService.cancelPool(poolId),
    );
  }
}
