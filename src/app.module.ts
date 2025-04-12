import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/tasks.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: +(config.get<number>('DATABASE_PORT') ?? 5432),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [User, Task],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
