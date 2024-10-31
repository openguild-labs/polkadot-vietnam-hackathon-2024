import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { createAccountDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/utils/ResMessage.utils';

@ApiTags('User')
@Controller('v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  async createAccount(@Body() body: createAccountDto) {
    return new ResponseMessage(
      200,
      'Create account successfully',
      await this.userService.createAndUpdateAccount(
        body.wallet_address,
        body.balance,
      ),
    );
  }

  @Get('user/:userId')
  async getAccount(@Param('userId') userId: string) {
    return new ResponseMessage(
      200,
      'Detail account',
      await this.userService.getAccount(userId),
    );
  }

  @Get('users')
  async getAllAccount() {
    return await this.userService.getAllAccounts();
  }

  @Delete('user/:userId')
  async deleteAccount(@Param('userId') userId: string) {
    return new ResponseMessage(
      200,
      'Delete account successdully',
      await this.userService.deleteAccount(userId),
    );
  }
}
