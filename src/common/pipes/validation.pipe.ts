import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {

    const object = plainToClass(metatype, value);

    if (!metatype || !this.toValidate(metatype)) {
      return object;
    }

    const errors = await validate(object, { whitelist: true,
                                            forbidNonWhitelisted: true 
                                          });

    if (errors.length > 0) {

      const errorsObj = {message: 'Validation failed', errors: {}};
      errors.forEach(error => {

        if (error.property === 'password' && 
          Object.values(error.constraints).join('').includes('regular expression')){
          errorsObj.errors[
                error.property] = 'Password must contain at least 1 upper case letter' +
                                  ', 1 lower case letter and 1 number or special character';
        } else {
          errorsObj.errors[error.property] = Object.values(error.constraints);
        };

      });

      throw new HttpException(errorsObj, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
