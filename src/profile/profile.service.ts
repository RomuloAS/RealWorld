import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ProfileData } from './profile.interface';
import { UserSelect } from '../user/user.select';
import { FollowedBySelect } from '../common/select/common.select';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(user: any, username: string): Promise<ProfileData> {
    const userProfile = await this.prisma.user.findUnique({
      where: { username: username },
      select: FollowedBySelect(user),
    });

    if (!userProfile) {
      throw new HttpException(
        {
          message: 'User Not Found',
          errors: { profile: 'Username does not represent any User' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.createUserProfile(
      userProfile,
      userProfile.followedBy.length ? true : false,
    );
  }

  async followUser(
    user: any,
    username: string,
    follow: boolean = true,
  ): Promise<ProfileData> {
    const userProfile = await this.getProfile(user, username);

    const data = { following: {} };
    if (follow) {
      userProfile.profile['following'] = true;
      data.following = { connect: { username: username } };
    } else {
      userProfile.profile['following'] = false;
      data.following = { disconnect: { username: username } };
    }

    const followed = await this.prisma.user.update({
      where: { email: user.email },
      data: data,
    });

    return userProfile;
  }

  private createUserProfile(user: any, following: boolean): ProfileData {
    const { username } = user;
    const { bio, image } = user.profile;
    const userProfile = {
      profile: {
        username: username,
        bio: bio,
        image: image,
        following: following,
      },
    };

    return userProfile;
  }
}
