import { SetMetadata } from '@nestjs/common';
import { Role as Roles } from 'src/users/users.interfaces';

export const Role = (role: Roles) => SetMetadata('role', role);
