

export class orderStatus {
    status_id : number;
    status: string;
    type : string;
    is_default: string;
    position: number;
}
export class orderStatusDescription {
    status_id : number;
    description: number;
    email_subj: string;
    email_header:string;
    lang_code : string;

}
export class orderStatusData {
    status_id : number;
    value: string;
    param : string;


}