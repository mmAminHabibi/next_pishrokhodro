
import {Field} from "@/app/shared/shared-form";


export interface FooterInterface {
    data: {
        resources_footer: {
            menu: MenuItem[]
        }
        copy_right: {
            menu: MenuItem[]
        }
        selling_footer: {
            menu: MenuItem[]
        }
        form_footer: {
            form_type: {
                active: number;
                captcha: number;
                created_at: string;
                description: string;
                end_time: string;
                fields: Field[];
                footnote: string;
                id: string;
                is_public: number;
                organization_id: number;
                start_time: string;
                title: string;
                updated_at: string;
                user_id: number;
            }
        }
    }
    service_meta_tags: MetaTagsInterface[]
    site:{
        meta_tags: MetaTagsInterface[]
    }
}

interface MenuItem {
    id: number;
    title: string;
    machine_name: string;
    form_type_id: number;
    form_field_type_id: number;
    all_active_menus: ContentInterface[]
}
