import {getContent} from "@/core/http";
import SharedImage from "@/app/shared/shared-image/shared-image";
import SharedTitle from "@/app/shared/shared-title/shared-title";


interface ContentServiceInterface {
    content: ContentInterface
}

interface FieldsInterface {
    text: string,
    title: string,
    field_type_id: number,
    value: number
}
interface PropsType {
    params: Promise<{ id: string }>,
    paramsSearch?: Promise<object>,
}
export default async function Page(props: PropsType){
    const {id} = await props.params;
    const data: ContentServiceInterface = await getContent(id)
    const article = data.content
    // console.log(data)
    return (
        <>

            <div className="container py-5">
                <SharedTitle title={ article.title } full={true}/>
                <div className="article mt-5">
                    <div className="article-image">
                        <SharedImage
                            className={'border-radius-14px'}
                            src={article.image_path}
                            alt={article.title}
                        />
                    </div>
                    <div className="article-content mt-5">
                        <div className="circular-info mt-4 text-justify fs-26px first-color fw-600" dangerouslySetInnerHTML={{ __html: article.body }}></div>
                    </div>
                </div>
            </div>

        </>
    )
}