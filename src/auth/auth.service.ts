import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthInput } from './dto/auth.input';
import { AuthType } from './dto/auth.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    return;
  }

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUserByEmail(data.email);
    const validPassword = compareSync(data.password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const token = await this.jwtToken(user);

    return {
      user,
      token,
    };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = {
      username: user.name,
      sub: user.id,
    };

    return this.jwtService.signAsync(payload);
  }
}
