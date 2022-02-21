import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<object> {
    const user = await this.userService.findOneByEmail(
      loginUserDto.email.toLowerCase(),
    );
    if (user !== null) {
      const hashedPassword = user.password;
      const isMatch = await bcrypt.compare(
        loginUserDto.password,
        hashedPassword,
      );
      if (user && isMatch) {
        const payload = { email: user.email };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    }

    throw new UnauthorizedException({ message: 'invalid email or password' });
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }
}
