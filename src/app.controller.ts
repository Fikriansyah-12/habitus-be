import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(JwtGuard)
  getProtected(@Request() req): object {
    return {
      message: 'This is a protected route',
      user: req.user,
      timestamp: new Date(),
    };
  }
}
