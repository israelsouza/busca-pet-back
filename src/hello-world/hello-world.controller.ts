import { Controller, Get, Inject } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';

@Controller()
export class HelloWorldController {
  constructor(
    @Inject(HelloWorldService)
    private readonly helloWorldService: HelloWorldService,
  ) {}

  @Get()
  getHello(): string {
    return this.helloWorldService.getHello();
  }
}
