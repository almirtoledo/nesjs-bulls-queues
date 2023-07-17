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
      const data: PaymentDto = job.data;
      this.logger.verbose(data);

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
      job.queue.add(job.name, job.data, {
        jobId: job.id,
        attempts: job.attemptsMade,
        timeout: 60 * 60 * 60,
      });
    }
  }
}
