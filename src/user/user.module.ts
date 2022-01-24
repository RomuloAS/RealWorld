import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../common/auth/auth.module';
import { IsUserAlreadyExistConstraint } from './user.validator';

@Module({
  imports: [AuthModule],
  providers: [UserService, IsUserAlreadyExistConstraint],
  controllers: [UserController],
})
export class UserModule {}
