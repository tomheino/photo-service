import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('photos')
@ApiTags('photos')
export class PhotosController {
    constructor(private photosService: PhotosService) {}
        
    @Post()
    @ApiOperation({summary: 'Add a new photo'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createPhotoUsingEmail(
        @Body() createPhotoDto: CreatePhotoDto
    ): Promise<Photo> {
        return await this.photosService.insertPhoto(createPhotoDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all Photos'})
    @ApiResponse({status: 200, description: 'OK'})
    async getPhotos(): Promise<Photo[]> {
        return await this.photosService.getPhotos();
    }

    @Get(':id')
    @ApiOperation({summary: 'Get a Photo by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    async getPhotoById(@Param('id') id: string) {
        return await this.photosService.findPhotoById(id);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update a Photo'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async updatePhotoD(
        @Param('id') id: string,
        @Body() updatePhotoDto: UpdatePhotoDto): Promise<Photo> {
        console.log(`updatePhoto: ${JSON.stringify(updatePhotoDto)}`)
        return await this.photosService.updatePhoto(id, updatePhotoDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete a Photo by ID'})
    @ApiResponse({status: 200, description: 'OK'})
    @ApiResponse({status: 404, description: 'Matching id not found'})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async deleteUserById(@Param('id') id: string): Promise<{ message: string }> {
        console.log(`deletePhoto ID: ${JSON.stringify(id)}`)
        await this.photosService.deletePhotoById(id);
        return { message: 'Photo deleted successfully' };
    }
}

