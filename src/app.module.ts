import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ovsepyan28:aQKCoDHPDa8GYHj3@chrono-planner-backend.zwesgnq.mongodb.net/?retryWrites=true&w=majority',
      { dbName: 'chrono-planner' },
    ),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
