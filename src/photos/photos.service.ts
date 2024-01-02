import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo) private photosRepository: Repository<Photo>,
        private usersService: UsersService,
        private categoriesService: CategoriesService,
    ) {}

    async insertPhoto(createPhotoDto: CreatePhotoDto): Promise<Photo> {
        const user = await this.usersService.findUserByUsername(createPhotoDto.username);

        if(!user) {
            throw new NotFoundException("User not found");
        }
        console.log(`insertPhoto user found ${user.username}`)

        const categoryPromises = createPhotoDto.categories?.map(async (categoryData) => {
          const existingCategory = await this.categoriesService.getCategoryByName(categoryData.name);
    
          if (existingCategory) {
            return existingCategory;
          } else {
            return this.categoriesService.insertCategory(categoryData);
          }
        });

        const categories = await Promise.all(categoryPromises);

        const photo = new Photo();
        photo.name = createPhotoDto.name;
        photo.description = createPhotoDto.description;
        photo.url = createPhotoDto.url;
        photo.user = user;
        photo.categories = categories;   // mod
        return await this.photosRepository.save(photo);
    }

    async getPhotos(): Promise<Photo []> {
        return this.photosRepository.find({relations: ["user", "categories"]})
    }

    async findPhotoById(id: string): Promise<Photo> {
      return await this.photosRepository.findOneBy({id: parseInt(id)});
    }

    async updatePhoto(id: string, updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
      const photo = await this.photosRepository.findOneBy({ id: parseInt(id) });

      if (!photo) {
        throw new NotFoundException('Photo not found');
      }

      if (updatePhotoDto.name) {
        photo.name = updatePhotoDto.name;
      }

      if (updatePhotoDto.description) {
        photo.description = updatePhotoDto.description;
      }

      if (updatePhotoDto.url) {
        photo.url = updatePhotoDto.url;
      }

      if (updatePhotoDto.username) {
        const user = await this.usersService.findUserByUsername(updatePhotoDto.username);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        photo.user = user;
      }

      if (updatePhotoDto.categories) {
        const updatedCategories = await Promise.all(
            updatePhotoDto.categories.map(async (categoryData) => {
                const existingCategory = await this.categoriesService.getCategoryByName(categoryData.name);

                if (existingCategory) {
                    return existingCategory;
                } else {
                    return this.categoriesService.insertCategory(categoryData);
                }
            }),
        );
        photo.categories = updatedCategories;
      }
        console.log(`updating ${JSON.stringify(photo)}`);
        return this.photosRepository.save(photo);
    }   
    
      async deletePhotoById(id: string): Promise<void> {
        const photo = await this.photosRepository.findOneBy({id: parseInt(id)});
        if (!photo) {
          throw new NotFoundException('Photo not found');
        }
    
        await this.photosRepository.remove(photo);
      }
}
