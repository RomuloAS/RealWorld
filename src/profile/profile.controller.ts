import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from '../user/user.decorator';
import { ProfileData } from './profile.interface';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { IsAuthOptional } from '../common/auth/auth.decorator';

@Controller('profiles')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @IsAuthOptional()
  async getProfile(@User() user, @Param('username') username: string): Promise<ProfileData> {
    return await this.profileService.getProfile(user, username);
  }

  @Post(':username/follow')
  @UseGuards(JwtAuthGuard)
  async followUser(@User() user, @Param('username') username: string): Promise<ProfileData> {
    return await this.profileService.followUser(user, username);
  }

  @Delete(':username/follow')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(@User() user, @Param('username') username: string): Promise<ProfileData> {
    return await this.profileService.followUser(user, username, false);
  }

}
