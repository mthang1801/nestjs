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

    @IsOptional()
    description: string;
    @IsOptional()
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
export class orderStatusUpdateDTO {
    @IsOptional()
    @MaxLength(1)
    status: string;
    @IsOptional()
    @MaxLength(1)
    type: string;
    @IsOptional()
    @MaxLength(1)
    is_default: string;
    @IsOptional()
    position: number;

    @IsOptional()
    description: string;
    @IsOptional()
    email_subj: string;
    @IsOptional()
    email_header: string;
    @IsOptional()
    lang_code: string;

    @IsOptional()
    param: number
    @IsOptional()
    value: number
}