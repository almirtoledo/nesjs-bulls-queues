import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PaymentDto } from './queue-consumer';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class QueueProducer {
  constructor(@InjectQueue('payments') private readonly producerQueue: Queue) {}

  @Interval(1000)
  async handle() {
    const payments: Array<PaymentDto> = [
      {
        title: 'Standard plan 30',
        price: 30,
      },
      {
        title: 'Broker plan 50',
        price: 50,
      },
      {
        title: 'RealSate plan 80',
        price: 80,
      },
      {
        title: 'Standard plan 90',
        price: 90,
      },
    ];

    const payment = payments[Math.floor(Math.random() * payments.length)];

    await this.producerQueue.add(payment);
  }
}
