import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import CategoryCreateDto from './dto/category.create.dto';
import CategoryUpdateDto from './dto/category.update.dto';
import CategoryNotFoundException from './exceptions/category.not.found.exception';
import Category from './category.entity';

@Injectable()
export default class CategoryService {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoryRepository.find({ relations: ['posts'] });
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne(id, { relations: ['posts'] });
    if (category) {
      return category;
    }
    throw new CategoryNotFoundException(id);
  }

  async createCategory(category: CategoryCreateDto) {
    const newCategory = await this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: CategoryUpdateDto) {
    await this.categoryRepository.update(id, category);
    const updatedCategory = await this.categoryRepository.findOne(id, { relations: ['posts'] });
    if (updatedCategory) {
      return updatedCategory
    }
    throw new CategoryNotFoundException(id);
  }

  async deleteCategory(id: number) {
    const deleteResponse = await this.categoryRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}