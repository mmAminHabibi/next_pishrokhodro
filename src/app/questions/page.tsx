import { getApiService } from "@/core/http";
import "./questions.scss";
import QuestionsAccordion from "@/app/questions/QuestionsAccordion";
import ServerError from "@/app/server-error/server-error";
import Loading from "@/app/loading";

export default async function Questions() {
    let data: PageInterface | null = null;

    try {
        data = await getApiService("questions");
    } catch (error) {
        return <ServerError />;
    }

    if (!data || !data.data?.questions?.contents?.data[0]) {
        return <Loading />;
    }
    const questions = data.data.questions.contents.data[0];

    return (
        <div className="container py-5">
            <div className="questions">
                <div className="questions-info">
                    <h2 className="fa-3x">{questions.title}</h2>
                    <p className="fs-20px"  dangerouslySetInnerHTML={{__html: questions.summary}}></p>
                </div>
                <QuestionsAccordion sections={questions.sections}/>
            </div>
        </div>
    );
}
