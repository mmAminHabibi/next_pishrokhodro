'use client';

import ImageContent from "@/app/[content]/imageContent";
import { getApiService, getContent, getApiSearch } from "@/core/http";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/[content]/content.scss";
import Loading from "@/app/loading";
import ProductsDetailsInfo from "@/app/products/[id]/[title]/products-details-info/products-details-info";
import SharedFilterCategory from "@/app/shared/shared-filter-category/shared-filter-category";
import ContentProductsList from "@/app/[content]/content-products-list";
import ServerError from "@/app/server-error/server-error";

interface ContentInterface {
    id: number | string;
    title: string;
    summary: string;
    body: string;
    image_path?: string;
    sections: ContentSectionInterface[];
    categories?: ContentCategoryInterface[];
}

interface CarListResponse {
    data: {
        car_list_type: {
            group: {
                active_categories: Array<{
                    id: number;
                    title: string;
                }>;
            };
        };
    };
}

interface TitlePageComponentProps {
    contentId?: number;
    contentKey?: string;
}
interface ApiError {
    status: number;
    message?: string;
}
const CONTENT_IDS: Record<string, number> = {
    agencies: 876,
    onlineSales: 923,
    customers: 787,
    service: 879,
    terms: 880,
    privacy: 881,
    security: 882,
    rules: 883,
    carList: 888,
    support : 886,
    sacrifice : 884,
    discharge : 887
};

const SACRIFICE_CATEGORY_ID = 324;

function TitlePageComponent({ contentId, contentKey }: TitlePageComponentProps) {
    const params = useParams<{ id?: string; content?: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const title = contentKey ?? params?.content;

    const [content, setContent] = useState<ContentInterface | null>(null);
    const [car, setCar] = useState<CarListResponse | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [categoriesWithContent, setCategoriesWithContent] = useState<Array<{ id: number; title: string }>>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [errorOccurred, setErrorOccurred] = useState(false);

    const carListTypeIdParam = searchParams?.get("car_list_type_id");
    const carListTypeId = carListTypeIdParam ? parseInt(carListTypeIdParam) : undefined;

    useEffect(() => {
        let fetchId: number | undefined;

        if (contentId) {
            fetchId = contentId;
        } else if (title && CONTENT_IDS[title]) {
            fetchId = CONTENT_IDS[title];
        } else if (params?.id) {
            const parsed = Number(params.id);
            if (!isNaN(parsed)) fetchId = parsed;
        }

        if (!fetchId) {
            setErrorOccurred(true);
            return;
        }

        const isCarListPage = (contentId ?? CONTENT_IDS[title ?? ""]) === 888;

        async function fetchContent(fetchId: number) {
            try {
                const res = await getContent(String(fetchId));
                const data: ContentInterface = res.content ?? res;
                setContent(data);

                if (isCarListPage) {
                    setCategoriesLoading(true);
                    const carData = await getApiService("car_list");
                    setCar(carData as CarListResponse);

                    try {
                        const allProductsResponse = await getApiSearch({
                            content_type_id: 65,
                            item_count: 100,
                            page: 1,
                            category_id: SACRIFICE_CATEGORY_ID,
                        });

                        const allProducts = allProductsResponse?.data?.search?.original?.contents?.data || [];
                        const categoryIdsWithContent = new Set<number>();

                        allProducts.forEach((product: ContentInterface) => {
                            product.categories?.forEach((cat: ContentCategoryInterface) => {
                                if (cat.id && cat.id !== SACRIFICE_CATEGORY_ID) {
                                    categoryIdsWithContent.add(cat.id);
                                }
                            });
                        });

                        const carDataTyped = carData as CarListResponse;
                        const filteredCategories = carDataTyped?.data?.car_list_type?.group?.active_categories?.filter(
                            (cat) => categoryIdsWithContent.has(cat.id)
                        ) ?? [];

                        setCategoriesWithContent(filteredCategories);
                    } catch (err) {
                        console.error("Error fetching categories with content:", err);
                        const carDataTyped = carData as CarListResponse;
                        setCategoriesWithContent(carDataTyped?.data?.car_list_type?.group?.active_categories ?? []);
                    } finally {
                        setCategoriesLoading(false);
                    }
                } else {
                    setCategoriesLoading(false);
                }
            } catch (err) {
                const apiError = err as ApiError;
                if (apiError?.status === 429) {
                    setErrorOccurred(true);
                } else {
                    setErrorOccurred(true);
                }
            }
        }

        fetchContent(fetchId);
    }, [title, contentId, params?.id]);

    const isCarListPage = (contentId ?? CONTENT_IDS[title ?? ""]) === 888;
    
    const carListCategories = categoriesLoading 
        ? [] 
        : categoriesWithContent.length > 0 
            ? categoriesWithContent 
            : car?.data?.car_list_type?.group?.active_categories ?? [];

    useEffect(() => {
        if (notFound) {
            router.push('/404');
        }
    }, [notFound, router]);

    if (errorOccurred) return <ServerError />;
    if (!content) return <Loading />;

    return (
        <div className="container-lg py-5">
            <div className="about border-radius-14px p-4">
                <h4 className="font-bold text-center text-blue-700 fa-3x">
                    {content.title}
                </h4>

                <div className="mt-5">
                    {content.image_path ? (
                        <div className="row">
                            <div className="col-lg-6 order-lg-1 order-2 col-12 mt-lg-0 mt-3">
                                <p className="fs-20px text-color">
                                    {content.summary?.split("\n").map((line, idx) => (
                                        <span key={idx}>
                                            {line}
                                            <br />
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div className="col-lg-6 order-lg-2 order-1 col-12 image-wrapper">
                                <ImageContent
                                    imagePath={content.image_path}
                                    alt={content.title}
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="fs-20px text-color">
                            {content.summary?.split("\n").map((line, idx) => (
                                <span key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </p>
                    )}
                </div>

                {!isCarListPage && content.body && (
                    <div className="mt-5 w-100">
                        <div
                            className="fs-20px text-color"
                            dangerouslySetInnerHTML={{ __html: content.body }}
                        />
                    </div>
                )}

                {isCarListPage && (
                    <>
                        <div className="mt-5 w-100">
                            <div className="row">
                                <div className="d-lg-flex align-items-center">
                                    <h5 className="me-lg-3 my-3">برندهای مشمول واردات جانبازی :</h5>
                                    {categoriesLoading ? (
                                        <div className="d-flex gap-2">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="loading-motion bg-light rounded-3"
                                                    style={{
                                                        width: '120px',
                                                        height: '45px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : carListCategories.length > 0 ? (
                                        <SharedFilterCategory
                                            data={carListCategories}
                                            activeId={carListTypeId ?? null}
                                            variant="product"
                                            urlParamName="car_list_type_id"
                                            preserveParams={["category_id", "page"]}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 w-100">
                            <ContentProductsList 
                                carListTypeId={carListTypeId} 
                                carListCategories={carListCategories}
                            />
                        </div>
                    </>
                )}

                <div className="mt-5">
                    <ProductsDetailsInfo sections={content.sections as ContentSectionInterface[]} />
                </div>
            </div>
        </div>
    );
}

export default function TitlePage() {
    return <TitlePageComponent />;
}

export { TitlePageComponent as TitlePage };
