import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    this.usersService.insert(createUserDto);
    return 'Add user ' + createUserDto.name;
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email;
    const password = loginDto.password;

    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
        return 'Welcome! ' + user.name;
    } else {
        throw new UnauthorizedException();
    }
  }
}