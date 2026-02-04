import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoriesService.getCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(
      createCategoryDto.category_name,
      createCategoryDto.description,
    );
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
