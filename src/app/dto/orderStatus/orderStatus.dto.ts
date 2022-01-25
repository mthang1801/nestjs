import { IsOptional, IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';
export class orderStatusCreateDTO {
    @IsNotEmpty()
    @MaxLength(1)
    status: string;
    @IsNotEmpty()
    @MaxLength(1)
    type: string;
    @IsOptional()
    @MaxLength(1)
    is_default: string;
    @IsOptional()
    position: number;

    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    email_subj: string;
    @IsNotEmpty()
    email_header: string;
    @IsOptional()
    lang_code: string;

    @IsOptional()
    param: number
    @IsOptional()
    value: number
}