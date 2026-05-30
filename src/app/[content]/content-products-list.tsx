'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getApiSearch } from "@/core/http";
import SharedProductCard from "@/app/shared/shared-product-card/shared-product-card";
import ContentListPagination from "@/app/shared/content-list/content-list-pagination/content-list-pagination";

interface ContentProductsListProps {
    carListTypeId?: number;
    carListCategories?: Array<{ id: number; title: string }>;
}

const SACRIFICE_CATEGORY_ID = 324;
const ITEMS_PER_PAGE = 6;
const MAX_ITEMS_FETCH = 100;

export default function ContentProductsList({ carListTypeId, carListCategories = [] }: ContentProductsListProps) {
    const searchParams = useSearchParams();
    
    const categoryIdParam = searchParams?.get("category_id");
    const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;
    const pageParam = searchParams?.get("page");
    const currentPage = pageParam ? parseInt(pageParam) : 1;
    const carListTypeIdFromUrl = searchParams?.get("car_list_type_id");
    const finalCarListTypeId = carListTypeId ?? (carListTypeIdFromUrl ? parseInt(carListTypeIdFromUrl) : undefined);

    const [products, setProducts] = useState<ContentInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        setLoading(true);
    }, [categoryId, finalCarListTypeId, currentPage]);

    useEffect(() => {
        let isMounted = true;
        
        async function fetchProducts() {
            try {
                let filteredContents: ContentInterface[] = [];

                if (categoryId) {
                    const categoryProducts = await getApiSearch({
                        content_type_id: 65,
                        item_count: MAX_ITEMS_FETCH,
                        page: 1,
                        category_id: categoryId,
                    });
                    
                    const sacrificeProducts = await getApiSearch({
                        content_type_id: 65,
                        item_count: MAX_ITEMS_FETCH,
                        page: 1,
                        category_id: SACRIFICE_CATEGORY_ID,
                    });
                    
                    const contents1 = categoryProducts?.data?.search?.original?.contents?.data || [];
                    const contents2 = sacrificeProducts?.data?.search?.original?.contents?.data || [];
                    const categoryProductIds = new Set(contents1.map((item: ContentInterface) => item.id));
                    
                    filteredContents = contents2.filter((item: ContentInterface) => {
                        const hasSacrificeCategory = item.categories?.some(
                            (cat: ContentCategoryInterface) => cat.id === SACRIFICE_CATEGORY_ID
                        );
                        const hasSelectedCategory = item.categories?.some(
                            (cat: ContentCategoryInterface) => cat.id === categoryId
                        );
                        const hasCarListType = finalCarListTypeId
                            ? item.categories?.some((cat: ContentCategoryInterface) => cat.id === finalCarListTypeId)
                            : true;
                        
                        return hasSacrificeCategory && hasSelectedCategory && hasCarListType && categoryProductIds.has(item.id);
                    });
                } else {
                    // استخراج تمام ID های دسته‌بندی‌های موجود
                    const allCategoryIds = carListCategories
                        .map(cat => cat.id)
                        .filter((id): id is number => id !== undefined);

                    // اگر دسته‌بندی‌ای لیست شده باشد، فقط محصولات آن دسته‌بندی‌ها را نمایش بده
                    const categoryFilter = allCategoryIds.length > 0 ? allCategoryIds : undefined;

                    const sacrificeProducts = await getApiSearch({
                        content_type_id: 65,
                        item_count: MAX_ITEMS_FETCH,
                        page: 1,
                        category_id: SACRIFICE_CATEGORY_ID,
                    });
                    
                    filteredContents = sacrificeProducts?.data?.search?.original?.contents?.data || [];
                    
                    // فیلتر بر اساس دسته‌بندی‌های لیست شده
                    if (categoryFilter && categoryFilter.length > 0) {
                        filteredContents = filteredContents.filter((item: ContentInterface) => {
                            return item.categories?.some(
                                (cat: ContentCategoryInterface) => categoryFilter.includes(cat.id)
                            );
                        });
                    }
                    
                    // فیلتر بر اساس carListTypeId اگر انتخاب شده باشد
                    if (finalCarListTypeId) {
                        filteredContents = filteredContents.filter((item: ContentInterface) => {
                            return item.categories?.some(
                                (cat: ContentCategoryInterface) => cat.id === finalCarListTypeId
                            );
                        });
                    }
                }
                
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const paginatedContents = filteredContents.slice(startIndex, endIndex);
                
                if (isMounted) {
                    setProducts(paginatedContents);
                    setLastPage(Math.ceil(filteredContents.length / ITEMS_PER_PAGE));
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                if (isMounted) {
                    setProducts([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProducts();
        
        return () => {
            isMounted = false;
        };
    }, [categoryId, finalCarListTypeId, currentPage, carListCategories]);

    if (loading) {
        return (
            <div className="row">
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <div key={i} className="col-12 col-md-4 mb-4">
                        <div className="loading-motion bg-light p-4 rounded-3 h-100">
                            <div className="aspect-ratio-16-9 bg-secondary mb-3 rounded-2"/>
                            <div className="bg-secondary mb-2" style={{height: 20, width: "70%"}}/>
                            <div className="bg-secondary" style={{height: 16, width: "50%"}}/>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <p className="text-center text-gray-500 py-5 fs-5">
                محتوایی در این دسته‌بندی وجود ندارد.
            </p>
        );
    }

    return (
        <>
            <div className="row">
                {products.map((item: ContentInterface, index: number) => (
                    <div key={index} className="col-12 col-md-4 mb-4">
                        <SharedProductCard data={item}/>
                    </div>
                ))}
            </div>
            {lastPage > 1 && (
                <div className="my-5 text-center">
                    <ContentListPagination 
                        currentPage={currentPage} 
                        lastPage={lastPage} 
                    />
                </div>
            )}
        </>
    );
}
