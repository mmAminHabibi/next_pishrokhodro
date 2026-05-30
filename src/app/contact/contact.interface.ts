import {Field} from "@/app/shared/shared-form";

export interface ContactPageInterface {
    data : {
        information:BlockInterface,
        contact_form: {
            form_type: {
                id : string
                fields: Field[]
            }
        }
    }
}