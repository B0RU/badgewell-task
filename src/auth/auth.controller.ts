import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtRefreshTokenGuard } from './jwt-refresh-token.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('auth/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Patch('auth/refresh-token')
  async RefreshToken(@GetUser() user: User, @Body() token: RefreshTokenDto) {
    const user_info = await this.authService.getUserIfRefreshTokenMatches(
      token.refresh_token,
      user._id,
    );
    if (user_info) {
      const userInfo = {
        id: user_info._id,
        email: user_info.email,
      };

      return this.authService.getNewAccessAndRefreshToken(userInfo);
    } else {
      return null;
    }
  }
}
