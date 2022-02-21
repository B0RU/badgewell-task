import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { jwtConstant } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: object }> {
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
        const payload = { email: user.email, id: user._id };
        const accessToken = await this.getAccessToken(payload);
        const refreshToken = await this.getRefreshToken(payload);

        await this.updateRefreshTokenInUser(payload.id, refreshToken);

        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: payload,
        };
      }
    }

    throw new UnauthorizedException({ message: 'invalid email or password' });
  }

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  async getAccessToken(payload: object) {
    const accessToken = await this.jwtService.sign(payload);
    return accessToken;
  }

  async getRefreshToken(payload: object) {
    const refreshToken = await this.jwtService.sign(payload, {
      secret: jwtConstant.REFRESH_TOKEN_SECRET,
      expiresIn: 60 * 60 * 24 * 30,
    });
    return refreshToken;
  }

  async updateRefreshTokenInUser(id: string, refreshToken: string) {
    if (refreshToken) {
      refreshToken = await bcrypt.hash(refreshToken, 10);
    }

    await this.userService.update(id, {
      hashedRefreshToken: refreshToken,
    });
  }

  async getNewAccessAndRefreshToken(payload) {
    const refreshToken = await this.getRefreshToken(payload);
    await this.updateRefreshTokenInUser(payload.id, refreshToken);

    return {
      accessToken: await this.getAccessToken(payload),
      refreshToken: refreshToken,
    };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this.userService.findOne(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      await this.updateRefreshTokenInUser(id, null);
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
