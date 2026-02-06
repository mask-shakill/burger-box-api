import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Patch,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Public } from 'src/common/public.decorator';
import { Protected } from 'src/common/protected.decorator';

@Protected()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Public()
  @Get(':id')
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    dto.image_url = await this.productsService.uploadImage(file);
    return this.productsService.createProduct(dto);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.image_url = await this.productsService.uploadImage(file);
    }
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
