import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersProvider } from './users.providers';
import { TasksProvider } from 'src/tasks/tasks.providers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UsersProvider, TasksProvider],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
