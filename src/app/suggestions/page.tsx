import {getApiService} from "@/core/http";
import "./suggestions.scss"
import { FormContact } from "@/app/shared/shared-form";
import {SuggestionsInterface} from "@/app/suggestions/suggestions.interface";
import ServerError from "@/app/server-error/server-error";
interface ApiError {
    status?: number;
    message?: string;
}
export default async function Suggestions(){
    let data: SuggestionsInterface | null = null;

    try {
        data = await getApiService("suggestions");
    } catch (error) {
        const apiError = error as ApiError;
        return <ServerError />;
    }

    if (!data?.data?.suggestions?.form_type) {
        return <ServerError />;
    }
    const suggestions = data.data.suggestions.form_type
    return(
        <>
            <div className="container py-5">
                <div className="suggestions">
                    <div className="suggestionss-info">
                        <h2 className="fa-3x">{ suggestions.title }</h2>
                        <p className="fs-20px"> { suggestions.description } </p>
                    </div>
                    <div className="suggestions-form">
                        <FormContact formId={suggestions.id} data={suggestions.fields} isRegistration={false} />
                    </div>
                </div>
            </div>
        </>
    )
}