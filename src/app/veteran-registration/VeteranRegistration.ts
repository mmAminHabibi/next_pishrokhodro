import {Field} from "@/app/shared/shared-form";

export interface VeteranRegistration {
    data: {
        veteran_registration: {
            form_type: {
                id: string;
                title: string;
                description: string;
                fields?: Field[];
            };
        };
    };
}
