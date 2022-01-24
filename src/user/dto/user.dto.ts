import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { IsUserAlreadyExist } from '../user.validator';

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export class CreateUserDTO {
  @IsNotEmpty()
  @MinLength(2)
  @IsUserAlreadyExist('email', { message: 'Username and email must be unique' })
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  readonly password: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @MinLength(2)
  @IsUserAlreadyExist('email', { message: 'Username and email must be unique' })
  readonly username: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  readonly password: string;

  @IsOptional()
  @MinLength(3)
  readonly bio: string;

  @IsOptional()
  @MinLength(1)
  readonly image: string;
}
