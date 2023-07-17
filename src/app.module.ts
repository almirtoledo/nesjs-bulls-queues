import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueConsumer } from './queue-consumer';
import { QueueProducer } from './queue-producer';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'payments',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [QueueConsumer, QueueProducer],
})
export class AppModule {}
