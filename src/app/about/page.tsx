import { getApiService } from "@/core/http";
import "../[content]/content.scss";
import ImageContent from "@/app/[content]/imageContent";
import ServerError from "@/app/server-error/server-error";
import Loading from "@/app/loading";

interface ApiError {
    status: number;
    message?: string;
}
export default async function About() {
    let data: AboutInterface | null = null;

    try {
        data = await getApiService("about");
    } catch (error) {
        const apiError = error as ApiError;
        if (apiError?.status === 429) {
            return <ServerError />;
        }
        return <ServerError />;
    }

    if (!data || !data.data?.about_vida?.contents?.data?.[0]) {
        return <Loading />;
    }
    const about = data.data.about_vida.contents.data[0]

    return (
        <div className="container-lg py-5">
            <div className="about border-radius-14px p-4">
                <h4 className="font-bold text-center text-blue-700 fa-3x">{about.title}</h4>
                <div className="mt-5">
                    <div className="row">
                        <div className="col-lg-6 order-lg-1 order-2 col-12  mt-lg-0 mt-3">
                            <p className="fs-20px text-color"  dangerouslySetInnerHTML={{__html: about.summary}}></p>
                        </div>

                        <div className="col-lg-6 order-lg-2 order-1 col-12 image-wrapper">
                            <ImageContent imagePath={about.image_path} alt={about.title} />
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <div
                        className="fs-20px text-color"
                        dangerouslySetInnerHTML={{ __html: about.body }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
