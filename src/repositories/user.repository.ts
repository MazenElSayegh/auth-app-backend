import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/data/schemas/user.schema';
import { AuthDto } from 'src/modules/auth/auth.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(user: AuthDto.SignupReq): Promise<User> {
    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser) throw new ConflictException('Email is already in use');
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
