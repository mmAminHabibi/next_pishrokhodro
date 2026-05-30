import {Field} from "@/app/shared/shared-form";

export interface SuggestionsInterface {
    data: {
        suggestions: {
            form_type: {
                id: string;
                title: string;
                description: string;
                fields?: Field[];
            };
        };
    };
}
