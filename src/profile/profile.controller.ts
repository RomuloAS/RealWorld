import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from '../user/user.decorator';
import { ProfileData } from './profile.interface';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { IsAuthOptional } from '../common/auth/auth.decorator';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('profiles')
@UsePipes(ValidationPipe)
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @IsAuthOptional()
  async getProfile(
    @User() user: any,
    @Param('username') username: string,
  ): Promise<ProfileData> {
    return await this.profileService.getProfile(user, username);
  }

  @Post(':username/follow')
  async followUser(
    @User() user: any,
    @Param('username') username: string,
  ): Promise<ProfileData> {
    return await this.profileService.followUser(user, username);
  }

  @Delete(':username/follow')
  async unfollowUser(
    @User() user: any,
    @Param('username') username: string,
  ): Promise<ProfileData> {
    return await this.profileService.followUser(user, username, false);
  }
}
