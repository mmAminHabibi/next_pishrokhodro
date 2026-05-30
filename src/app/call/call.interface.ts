

import {Field} from "@/app/shared/shared-form";

export interface CallInterface {
    data : {
        call: {
            form_type: {
                title : string,
                description : string,
                id : string
                fields: Field[]
            }
        }
    }
}