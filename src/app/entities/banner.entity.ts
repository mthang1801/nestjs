

export class Banner {
    banner_id : number;
    status: string;
    type : string;
    target: string;
    localization: string;
    created_at: number;
    position: number;
}
export class BannerImages {
    banner_id : number;
    banner_image_id: number;
    lang_code : string;

}
export class BannerDescriptions {
    banner_id : number;
    banner: string;
    url : string;
    description : string;
    lang_code: string;

}