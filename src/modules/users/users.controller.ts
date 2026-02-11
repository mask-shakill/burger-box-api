import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Protected } from 'src/common/protected.decorator';
import { Public } from 'src/common/public.decorator';

@Protected('admin')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Protected()
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Protected()
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Public()
  @Get('public-info')
  getPublicInfo() {
    return { message: 'This route is public' };
  }
}
