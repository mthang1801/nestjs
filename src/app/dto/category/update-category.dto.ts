import { IsOptional } from 'class-validator';
export class UpdateCategoryDescriptionDto {
  @IsOptional()
  category_id: number;

  @IsOptional()
  lang_code: string;

  @IsOptional()
  category: string;

  @IsOptional()
  description: string;

  @IsOptional()
  meta_keywords: string;

  @IsOptional()
  meta_description: string;

  @IsOptional()
  page_title: string;

  @IsOptional()
  age_warning_message: string;
}

export class UpdateCategoryVendorProductCountDto {
  @IsOptional()
  company_id: number;

  @IsOptional()
  category_id: number;

  @IsOptional()
  product_count: number;
}
