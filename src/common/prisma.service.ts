import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
    super({ adapter });

    return Object.assign(
      this,
      this.$extends({
        query: {
          $allOperations: async ({ operation, model, args, query }) => {
            const start = Date.now();
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const result = await query(args);

              // pengganti $on('query') dan $on('info')
              this.logger.info(
                `[Prisma] ${model}.${operation} — ${Date.now() - start}ms`,
              );

              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return result;
            } catch (error) {
              // pengganti $on('error')
              this.logger.error(`[Prisma] ${model}.${operation} failed`, {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                error,
              });
              throw error;
            }
          },
        },
      }),
    );
  }

  async onModuleInit() {
    await this.$connect();
    // $on sudah tidak ada, onModuleInit hanya untuk $connect
    this.logger.info('Prisma connected');
  }
}
