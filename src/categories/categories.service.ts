import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>

    ) {}

    async insertCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = new Category();
        category.name = createCategoryDto.name;
        category.description = createCategoryDto.description;
        console.log(`saving category: ${JSON.stringify(category)}`)
        return this.categoriesRepository.save(category);
    }

    async getCategories(): Promise<Category[]> {
        return await this.categoriesRepository.find();
    }

    async getCategoryByName(name: string): Promise<Category | undefined> {
        try {
            return await this.categoriesRepository.findOneOrFail({ where: {name} });
        } catch (error) {
            return undefined;
        }
    }
    
    async findCategoryById(id: string): Promise<Category> {
        return await this.categoriesRepository.findOneBy({id: parseInt(id)});
    }

    async updateCategory(id: string, updateCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = await this.categoriesRepository.findOneBy({id: parseInt(id)});
        if (!category) {
          throw new NotFoundException('Category not found');
        }
    
        category.name = updateCategoryDto.name || category.name;
        category.description = updateCategoryDto.description || category.description;
    
        console.log(`updating ${JSON.stringify(category)}`);
        return this.categoriesRepository.save(category);
      }
    async deleteCategoryById(id: string): Promise<void> {
        const category = await this.categoriesRepository.findOneBy({id: parseInt(id)});
        if (!category) {
          throw new NotFoundException('Category not found');
        }
        console.log(`deleting ${JSON.stringify(category)}`);
        await this.categoriesRepository.remove(category);
    }
}
