'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import style from './shared-filter-category.module.scss';
import { getApiSearch } from "@/core/http";

interface SharedFilterCategoryProps {
    data: { id: number | undefined; title: string }[];
    activeId?: number | null;
    variant?: "product" | "warranty" | "find";
    onSelect?: (
        id?: number,
        newData?: ContentInterface[],
        pagination?: { currentPage: number; lastPage: number }
    ) => void;
    onStartLoading?: () => void;
    urlParamName?: string;
    preserveParams?: string[];
}

export default function SharedFilterCategory({
                                                 data,
                                                 activeId,
                                                 variant = "product",
                                                 onSelect,
                                                 onStartLoading,
                                                 urlParamName = "category_id",
                                                 preserveParams = []
                                             }: SharedFilterCategoryProps) {

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const [isMobile, setIsMobile] = useState(false);
    const [localActiveId, setLocalActiveId] = useState<number | undefined | null>(activeId ?? null);
    const [isLoading, setIsLoading] = useState(false); // 🔒 وضعیت disable

    useEffect(() => {
        setLocalActiveId(activeId ?? null);
    }, [activeId]);

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 768);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    if (!data?.length) return null;

    const activeCategoryId =
        variant === "warranty" && localActiveId === undefined
            ? data[0].id
            : localActiveId ?? null;

    const handleClick = (id?: number) => {
        if (isLoading) return; // ⛔ قفل کلیک‌ها

        setIsLoading(true);
        setLocalActiveId(id ?? null);
        onStartLoading?.();

        /* ---------- FIND ---------- */
        if (variant === "find") {
            const idsToSend = id === undefined
                ? data.map(d => d.id!).filter(Boolean)
                : [id];

            getApiSearch({ category_id: idsToSend[0], light: true })
                .then(
                    res => {
                        onSelect?.(id, res.data.search.original.contents.data)
                    }


                )
                .catch(() => onSelect?.(id, []))
                .finally(() => setIsLoading(false));
            return;
        }

        /* ---------- URL ---------- */
        const currentParams = new URLSearchParams(searchParams.toString());

        preserveParams.forEach(p => {
            const v = searchParams.get(p);
            if (v) currentParams.set(p, v);
        });

        if (id === undefined || activeCategoryId === id) {
            currentParams.delete(urlParamName);
        } else {
            currentParams.set(urlParamName, id.toString());
        }

        currentParams.delete('page');

        const queryString = currentParams.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        window.history.replaceState({}, '', newUrl);

        /* ---------- PRODUCT ---------- */
        if (variant === "product" && onSelect) {
            const allIds = data.map(d => d.id!).filter(Boolean);
            const categoryIdToSend = id ?? allIds;

            startTransition(() => {
                router.replace(newUrl, { scroll: false });
            });

            getApiSearch({
                content_type_id: 65,
                item_count: 6,
                light: true,
                category_id: categoryIdToSend
            })
                .then(res => {
                    const contents = res.data.search.original.contents.data || [];
                    const currentPage = res.data.search.original.contents.current_page || 1;
                    const lastPage = res.data.search.original.contents.last_page || 1;
                    onSelect?.(id, contents, { currentPage, lastPage });
                })
                .catch(() => {
                    onSelect?.(id, [], { currentPage: 1, lastPage: 1 });
                })
                .finally(() => setIsLoading(false));
            return;
        }

        /* ---------- WARRANTY ---------- */
        startTransition(() => {
            router.replace(newUrl, { scroll: false });
        });

        setIsLoading(false);
    };

    let categoriesToRender = data;
    if (variant === "product" || variant === "find") {
        categoriesToRender = [{ id: undefined, title: "همه" }, ...data];
    }

    const textColorClass = variant === "find" ? "text-white" : "first-color";

    const renderCategoryItem = (item: { id?: number; title: string }) => {
        const isActive = item.id === activeCategoryId || (!item.id && !activeCategoryId);

        return (
            <a
                key={item.id ?? 'all'}
                href={item.id ? `?category_id=${item.id}` : '?'}
                onClick={e => {
                    e.preventDefault();
                    handleClick(item.id);
                }}
                className={`${isActive ? 'active' : ''} shared-filter-category-item d-flex align-items-center gap-2 ${textColorClass} fs-16px py-2 px-3 border-radius-14px position-relative overflow-hidden`}
            >
                <span className="position-relative z-1">{item.title}</span>
            </a>
        );
    };

    const wrapperProps = {
        className: `${style['shared-filter-category']} overflow-hidden w-100`,
        'data-disabled': isLoading,
        'aria-disabled': isLoading
    };

    if (variant === "find") {
        return (
            <div {...wrapperProps}>
                {isMobile ? (
                    <Swiper modules={[FreeMode]} freeMode slidesPerView="auto" spaceBetween={8} className="py-2 !overflow-x-hidden">
                        {categoriesToRender.map(item => (
                            <SwiperSlide key={item.id ?? 'all'} style={{ width: 'auto', maxWidth: '85vw' }}>
                                {renderCategoryItem(item)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {categoriesToRender.map(renderCategoryItem)}
                    </div>
                )}
            </div>
        );
    }

    if (variant === "warranty") {
        return (
            <div {...wrapperProps}>
                {isMobile ? (
                    <Swiper modules={[FreeMode]} freeMode slidesPerView="auto" spaceBetween={12} className="py-2 !overflow-x-hidden">
                        {data.map(item => (
                            <SwiperSlide key={item.id ?? 'all'} style={{ width: 'auto' }}>
                                {renderCategoryItem(item)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="d-flex flex-column gap-2 align-items-start">
                        {data.map(renderCategoryItem)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div {...wrapperProps}>
            <Swiper modules={[FreeMode]} freeMode slidesPerView="auto" spaceBetween={12} className="py-2">
                {categoriesToRender.map(item => (
                    <SwiperSlide key={item.id ?? 'all'} style={{ width: 'auto' }}>
                        {renderCategoryItem(item)}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
