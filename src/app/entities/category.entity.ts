export class CategoryEntity {
  category_id: number;
  parant_id: number;
  id_path: string;
  level: number;
  company_id: number;
  usergroup_ids: string;
  status: string;
  product_count: number;
  position: number;
  timestampt: Date;
  is_op: string;
  localization: string;
  age_verification: string;
  age_limit: number;
  parent_age_verification: string;
  parent_age_limit: number;
  selected_views: string;
  default_view: string;
  product_details_view: string;
  product_columns: number;
  is_trash: string;
  category_type: string;
}

export class CategoryDescriptionEntity {
  category_id: number;
  lang_code: string;
  category: string;
  description: string;
  meta_keywords: string;
  meta_description: string;
  page_title: string;
  age_warning_message: string;
}

export class CategoryVendorProductCount {
  company_id: number;
  category_id: number;
  product_count: number;
}
