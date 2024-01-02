import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePhotoDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    url: string;
    @ApiProperty()
    @IsString()
    username: string;
    @ApiProperty()
    categories: {
        name: string;
        description: string}[];
}