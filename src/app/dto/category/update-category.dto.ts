import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  category_id: number;

  @IsOptional()
  parent_id: number;

  @IsOptional()
  id_path: string;

  @IsOptional()
  level: number;

  @IsOptional()
  company_id: number;

  @IsOptional()
  usergroup_ids: string;

  @IsOptional()
  status: string;

  @IsOptional()
  product_count: number;

  @IsOptional()
  position: number;

  @IsOptional()
  is_op: string;

  @IsOptional()
  localization: string;

  @IsOptional()
  age_verification: string;

  @IsOptional()
  age_limit: number;

  @IsOptional()
  parent_age_verification: string;

  @IsOptional()
  parent_age_limit: number;

  @IsOptional()
  selected_views: string;

  @IsOptional()
  default_view: string;

  @IsOptional()
  product_details_view: string;

  @IsOptional()
  product_columns: string;

  @IsOptional()
  is_trash: string;

  @IsOptional()
  category_type: string;
}

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
  @IsNotEmpty()
  company_id: number;

  @IsNotEmpty()
  category_id: number;

  @IsNotEmpty()
  product_count: number;
}
