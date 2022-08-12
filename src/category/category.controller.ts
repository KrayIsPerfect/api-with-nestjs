import {
  Body,
  ClassSerializerInterceptor,   Controller,
  Delete,
  Get,
  Param,
  Patch,
Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import JwtAuthenticationGuard from '../authentication/jwt.authentication.guard';
import { FindOneParams } from '../utils/find.one.params';

import CategoryCreateDto from './dto/category.create.dto';
import CategoryUpdateDto from './dto/category.update.dto';
import CategoryService from './category.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param() { id }: FindOneParams) {
    return this.categoryService.getCategoryById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createCategory(@Body() category: CategoryCreateDto) {
    return this.categoryService.createCategory(category);
  }

  @Patch(':id')
  async updateCategory(@Param() { id }: FindOneParams, @Body() category: CategoryUpdateDto) {
    return this.categoryService.updateCategory(Number(id), category);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: FindOneParams) {
    return this.categoryService.deleteCategory(Number(id));
  }
}