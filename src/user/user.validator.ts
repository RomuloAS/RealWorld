import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PrismaService } from 'nestjs-prisma';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected readonly prisma: PrismaService) {}

  async validate(username: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const email = (args.object as any)[relatedPropertyName];

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: username,
          },
          {
            email: email,
          },
        ],
      },
    });

    return !user;
  }
}

export function IsUserAlreadyExist(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
