import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const CreatedUser = new this.userModel({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email.toLowerCase(),
      password: hashedPassword,
    });
    return CreatedUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const requiredUser = await this.userModel.findById(id);
    if (!requiredUser) {
      throw new NotFoundException();
    }
    return requiredUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    const requiredUser = await this.userModel.findOne({ email: email });
    if (!requiredUser) {
      return null;
    }
    return requiredUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const findUserAndUpdate = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
    );
    if (!findUserAndUpdate) {
      throw new NotFoundException();
    }
    return findUserAndUpdate;
  }

  async remove(id: string): Promise<void> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException();
    }
  }
}
