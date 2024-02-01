import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [AuthService, AuthGuard, UsersService],
  controllers: [AuthController],
  exports: [AuthGuard],
})
export class AuthModule {}
