import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //CREATE user by posting to 'api/users'
  @Post('auth/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //GET All Users by getting 'api/users'
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  //GET A Single User by getting 'api/users/:id'
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  //UPDATE a User by Putting 'api/users/:id'
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  //DELETE a User by deleting at 'api/users/:id'
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
