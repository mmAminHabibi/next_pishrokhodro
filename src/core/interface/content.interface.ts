// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ContentInterface {
    id: number,
    title: string,
    summary: string,
    body: string,
    image_path: string,
    thump_path: string,
    fields: string,
    categories: ContentCategoryInterface[],
    publish_date: string,
    tags:[],
    files: ContentFileInterface[],
    content_type_id: number,
    updated_at: number,
    pictures?: ContentPicturesInterface,
    sections:ContentSectionInterface[]
    data?: ContentInterface,
    information?: {
        contents?: {
            data?: Array<{
                // title: ReactNode;
                files: ContentFileInterface[];
            }>
        }
    }
    link:string,
    description:string,
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ContentFieldsInterface {
    field_type_id:number,
    text:string,
    title:string,
    value:number
}

interface ContentSectionInterface {
    id:number,
    text:string,
    title:string,
    body:string
}
interface ContentCategoryInterface {
    id: number,
    title: string,
    description: string,
    image_path: string
}

interface ContentFileInterface {
    id: number,
    title: string,
    description: string;
    url: string;
    file_name: string;
    file: {
        id: number,
        thump_path: string,
        description: string,
        file_path: string
    }
}

interface ContentPicturesInterface {
    banner:{
        id: number,
        title:string
        file_path: string,
        thump_path: string,
    }
}