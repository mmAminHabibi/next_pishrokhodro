import { getContent } from "@/core/http";
import SharedImage from "@/app/shared/shared-image/shared-image";
import SeoHead from "@/core/seo-head";
import Loading from "@/app/loading";
import ServerError from "@/app/server-error/server-error";
import { ApiError } from "@/core/api-error";

interface ProductsProps {
    params: Promise<{ id: string }>;
}

// interface ContentInterface {
//     title: string;
//     summary: string;
//     body: string;
//     image_path: string;
// }

interface ContentServiceInterface {
    content: ContentInterface;
}


export default async function Products({ params }: ProductsProps) {
    const { id } = await params;

    let data: ContentServiceInterface | null = null;

    try {
        data = await getContent(id);
    } catch (error) {
        if (error instanceof ApiError && error.status === 429) {
            return <ServerError />;
        }
        throw error;
    }

    if (!data || !data.content) {
        return <Loading />;
    }

    const content : ContentInterface = data.content;

    return (
        <div className="container my-5">
            <SeoHead post={content} />

            <div className="content-title">
                <h3 className="fa-2x fw-bold first-color mb-3">{content.title}</h3>
            </div>

            <div className="content bg-color border-radius-14px overflow-hidden">
                <div className="content-image text-center border-radius-14px overflow-hidden">
                    <SharedImage
                        width={1900}
                        height={500}
                        aspect="5/2"
                        src={content.image_path}
                        alt={content.title}
                    />
                </div>

                <div className="content-info p-4">
                    <div className="content-info-summary">
                        <h2 className="fs-24px first-color fw-bold">خلاصه مطلب</h2>
                        <p className="text-color mt-3 fs-18px text-justify"  dangerouslySetInnerHTML={{__html: content.summary}}></p>
                    </div>

                    <div className="content-info-body mt-5">
                        <h2 className="fs-26px first-color fw-bold">توضیحات بیشتر</h2>
                        <div
                            className="mt-3 fs-20px"
                            style={{ textAlign: "justify" }}
                            dangerouslySetInnerHTML={{ __html: content.body }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
