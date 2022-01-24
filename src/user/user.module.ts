import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../common/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [
    UserService
  ],
  controllers: [
    UserController
  ]
})
export class UserModule {}
