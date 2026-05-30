import SharedTitle from "@/app/shared/shared-title/shared-title";
import ContentList from "@/app/shared/content-list/content-list";
import SharedBlogCard from "@/app/shared/shared-blog-card/shared-blog-card";
import { getApiService } from "@/core/http";
import Loading from "@/app/loading";

interface BlogsProps {
    searchParams?: { page?: string };
}

export default async function Blogs({ searchParams }: BlogsProps) {
    const data: blogsInterface = await getApiService("blogs");

    const pageParam = searchParams?.page;
    const page = pageParam ? parseInt(pageParam) : undefined;

    const params: ParamsSearchInterface = {
        content_type_id: 20,
        item_count: 6,
        ...(page ? { page } : {}),
    };

    const blogs = data?.data?.blogs?.contents?.data || [];

    return (
        <>
            { !blogs && <Loading /> }
            <div className="container-lg blogs my-5 bg-color border-radius-14px p-4">
                <div className="row">
                    <div className="col-12 mb-4">
                        <SharedTitle title="مجله پیشرو خودرو ویدا" full />
                    </div>

                    <div className="col-12">
                        <ContentList
                            column="col-12 col-md-4"
                            params={params}
                            renderItem={(item: ContentInterface, idx: number) => (
                                <div key={idx}>
                                    <SharedBlogCard loading={!blogs.length} item={item} />
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
