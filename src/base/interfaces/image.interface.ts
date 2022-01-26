export interface IImages {
  image_id: number;
  image_path: string;
  image_x: number;
  image_y: number;
  is_high_res: string;
}

export interface IImagesLinks {
  object_id: number;
  object_type: string;
  image_id: number;
  detailed_id: number;
  type: string;
  position: number;
}
