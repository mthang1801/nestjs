import { Optional } from '@nestjs/common';
import { IsOptional, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class BannerCreateDTO{
    @IsOptional()
    status : string;
    @IsOptional()
    type :string;
    @IsOptional()
    target: string;
    @IsOptional()
    localization: string;
    @IsOptional()
    position: number;
    @IsNotEmpty()
    image_url: string;
    @IsNotEmpty()
    banner: string;
    @IsOptional()
    description: string;
    @Optional()
    url:string;
    @Optional()
    image_x: number
    @Optional()
    image_y: number
    @Optional()
    is_high_res: string
}