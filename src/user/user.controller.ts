import { Controller, Get, Post, Put, Body, UsePipes, UseGuards } from '@nestjs/common';
import { LoginUserDTO, CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserData } from './user.interface';
import { UserService } from './user.service';
import { User } from './user.decorator';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';

@Controller()
export class UserController {

  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post('users/login')
  async login(@Body('user') loginUserDTO: LoginUserDTO): Promise<UserData> {
    return await this.userService.login(loginUserDTO);
  }

  @UsePipes(ValidationPipe)
  @Post('users')
  async create(@Body('user') createUserDTO: CreateUserDTO): Promise<UserData> {
    return await this.userService.create(createUserDTO);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@User() user): Promise<UserData> {
    return {user: user};
  }

  @Put('user')
  @UseGuards(JwtAuthGuard)
  async updateUser(@User() user, @Body('user',
                ValidationPipe) updateUserDTO: UpdateUserDTO): Promise<UserData> {
    return await this.userService.update(user, updateUserDTO);
  }

}
