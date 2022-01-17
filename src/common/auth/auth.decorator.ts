import { SetMetadata } from '@nestjs/common';

export const IS_AUTH_OPTIONAL = 'isAuthOptional';
export const IsAuthOptional = () => SetMetadata(IS_AUTH_OPTIONAL, true);
