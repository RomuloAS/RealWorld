import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../common/prisma/prisma.module';
import { AuthModule } from '../common/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule
  ],
  providers: [
    UserService
  ],
  controllers: [
    UserController
  ]
})
export class UserModule {}
