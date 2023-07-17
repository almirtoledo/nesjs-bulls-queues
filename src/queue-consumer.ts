import { Injectable, Logger } from '@nestjs/common';
import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

export interface PaymentDto {
  title: string;
  price: number;
}

@Processor('payments')
@Injectable()
export class QueueConsumer {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  @Process()
  queueProcess(job: Job) {
    try {
      this.logger.verbose(`Job received id ${job.id} with name ${job.name}`);
      const data = job.data;

      if (data?.test) {
        this.logger.error('erro');
      }

      if (data.price === 90) {
        throw new Error('Error in processing payment');
      }
    } catch (error) {
      throw new Error('Error in processing payment');
    }
  }

  @OnQueueFailed()
  async queueFailed(job: Job, error: Error) {
    if (job.attemptsMade < 2) {
      this.logger.error('Attempt: ', job.attemptsMade);
      await job.queue.add(
        job.name,
        { test: true },
        {
          attempts: job.opts.attempts,
          delay: 1 * 60 * 500,
        },
      );
    }
  }
}
