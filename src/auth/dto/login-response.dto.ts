import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

