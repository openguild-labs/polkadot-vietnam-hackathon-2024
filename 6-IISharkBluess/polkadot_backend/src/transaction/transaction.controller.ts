import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { ResponseMessage } from 'src/utils/ResMessage.utils';
import { createTransactionDto } from './dto/transaction.dto';

@ApiTags('Transaction')
@Controller('v1')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transaction')
  async createTransaction(@Body() body: createTransactionDto) {
    return new ResponseMessage(
      200,
      'transaction success',
      await this.transactionService.createTransaction(body),
    );
  }

  @Get('transaction/:address')
  async getUserTransactions(@Param('address') address: string) {
    const transactionList =
      await this.transactionService.getUserTransactionList(address);
    return new ResponseMessage(200, 'Transaction success', transactionList);
  }

  @Get('transactions')
  async getAllTransactions() {
    const transactionList = await this.transactionService.getAllTrasaction();
    return new ResponseMessage(200, 'Transaction success', transactionList);
  }
}
