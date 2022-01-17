import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ProfileData } from './profile.interface';
import { PrismaService } from '../common/prisma/prisma.service';

const select = {
  username: true,
  profile: {select: {bio: true, image: true},
  }
};

@Injectable()
export class ProfileService {

  constructor(private prisma: PrismaService){}

  async getProfile(user, username: string): Promise<ProfileData> {

    const userProfile = await this.prisma.user.findUnique({
      where: {username: username},
      select: {...select, 
              followedBy: {
                where: {
                  username: user ? user.username : ''
                },
                select: {username: true}
              }
            }
      });

    if (!userProfile){
      this.userNotFound();
    }

    userProfile['following'] = userProfile.followedBy.length ? true : false;

    return this.createUserProfile(userProfile);
  }

  async followUser(user, username: string, follow: boolean = true): Promise<ProfileData> {

    const userProfile = await this.prisma.user.findUnique({
      where: {username: username},
      select: select
    });

    if (!userProfile){
      this.userNotFound();
    }

    const data = {following: {}}
    if (follow){
      userProfile['following'] = true;
      data.following = {connect: {username: username}}
    } else {
      userProfile['following'] = false;
      data.following = {disconnect: {username: username}}
    }

    const followed = await this.prisma.user.update({
      where: {email: user.email},
      data: data,
    });

    return this.createUserProfile(userProfile);
  }

  private userNotFound(){
    throw new HttpException({
        message: 'User Not Found',
        errors: {profile: 'Username does not represent any User'}},
        HttpStatus.NOT_FOUND);
  }

  private createUserProfile(user): ProfileData {

    const { username, following } = user;
    const { bio, image } = user.profile;
    const userProfile = {profile: {
                            username: username,
                            bio: bio,
                            image: image,
                            following: following
                          }
                        };

    return userProfile;

  }

}