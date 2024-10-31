import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(data: createTransactionDto) {
    const { hash, sender, receiver, token, symbol, amount, to_smart_contract } =
      data;
    return this.prisma.transaction.create({
      data: {
        hash,
        sender,
        receiver,
        token,
        amount,
        to_smart_contract,
        symbol,
      },
    });
  }

  async getUserTransactionList(address: string) {
    const send_transaction = await this.prisma.transaction.findMany({
      where: {
        sender: address,
      },
    });

    const receive_transaction = await this.prisma.transaction.findMany({
      where: {
        receiver: address,
      },
    });
    return {
      send_transaction_list: send_transaction,
      receive_transaction_list: receive_transaction,
    };
  }

  async getAllTrasaction() {
    return await this.prisma.transaction.findMany();
  }
}
