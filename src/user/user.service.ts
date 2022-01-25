import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { LoginUserDTO, CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserData } from './user.interface';
import { UserSelect } from './user.select';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(payload: LoginUserDTO): Promise<UserData> {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: { password: true, ...UserSelect.select },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Login failed', errors: { user: 'Wrong email' } },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passVerification = await verify(user.password, payload.password);

    if (!passVerification) {
      throw new HttpException(
        { message: 'Login failed', errors: { user: 'Wrong password' } },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.createUserAuth(user);
  }

  async create(payload: CreateUserDTO): Promise<UserData> {
    const { username, email, password } = payload;

    const data = {
      username: username,
      email: email,
      password: await hash(password),
      profile: { create: {} },
    };

    const user = await this.prisma.user.create({
      data: data,
      select: UserSelect.select,
    });

    return this.createUserAuth(user);
  }

  async update(oldUser, newData: UpdateUserDTO): Promise<UserData> {
    const { email, username, password, image, bio } = newData;
    const data = {
      email: email,
      username: username,
      password: password ? await hash(password) : undefined,
      profile: { update: { bio: bio, image: image } },
    };

    const user = await this.prisma.user.update({
      where: { email: oldUser.email },
      data: data,
      select: UserSelect.select,
    });

    return this.createUserAuth(user);
  }

  private createUserAuth(user): UserData {
    const { email, username } = user;
    const { bio, image } = user.profile;
    const userAuth = {
      user: { email: email, username: username, bio: bio, image: image },
    };

    const token = this.jwtService.sign(userAuth);
    userAuth.user['token'] = token;

    return userAuth;
  }
}
