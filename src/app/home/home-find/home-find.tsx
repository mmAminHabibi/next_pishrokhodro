'use client';

import { useState, useRef, useEffect } from 'react';
import style from './home-find.module.scss';
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SharedImage from "@/app/shared/shared-image/shared-image";
import 'swiper/css';
import 'swiper/css/navigation';
import SharedFilterCategory from "@/app/shared/shared-filter-category/shared-filter-category";
import type { Swiper as SwiperClass } from "swiper";
import {getApiSearch} from "@/core/http"; // ✅ اضافه شد

interface findHome {
    category?: BlockCategoryInterface;
}

export default function HomeFind({ category }: findHome) {
    const [activeCategory, setActiveCategory] = useState<number | undefined>(undefined);
    const [searchResults, setSearchResults] = useState<ContentInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

    const prevRef = useRef<HTMLDivElement | null>(null);
    const nextRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();

            const timer = setTimeout(() => setIsLoading(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [swiperInstance]);

    useEffect(() => {
        if (!category?.group?.active_categories?.length) return;

        setIsLoading(true);

        getApiSearch({
            category_id: category.group.active_categories[0].id,
            light: true,
        })
            .then(res => {
                setSearchResults(
                    res?.data?.search?.original?.contents?.data || []
                );
            })
            .catch(() => {
                setSearchResults([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [category]);

    const handleSelect = (id?: number, newData?: ContentInterface[]) => {
        setActiveCategory(id);
        setSearchResults(newData || []);
        setIsLoading(false);
    };


    const startLoading = () => setIsLoading(true);

    if (!category?.group?.active_categories?.length) {
        return null
    }
    const formatSummary = (summary?: string): string[] => {
        if (!summary) return [];

        return summary
            // تبدیل line-break های HTML
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')

            // حذف تمام تگ‌های HTML
            .replace(/<[^>]+>/g, '')

            // تبدیل نیم‌فاصله HTML به نیم‌فاصله واقعی فارسی
            .replace(/&zwnj;/gi, '\u200C')

            // فاصله‌های اضافی
            .replace(/&nbsp;/gi, ' ')

            // نرمال‌سازی فاصله‌ها
            .replace(/\s+\n/g, '\n')
            .replace(/\n\s+/g, '\n')
            .replace(/\n{2,}/g, '\n')

            // خروجی نهایی
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    };

    const renderActualSlider = () => (
        <Swiper
            onSwiper={setSwiperInstance}
            modules={[ Navigation]}
            speed={1000}
            spaceBetween={50}
            slidesPerView={1.5}
            centeredSlides={true}
            loop={true}
            initialSlide={1}
            breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 18 },
                700: { slidesPerView: 1.5 },
            }}
        >
            {searchResults.map((item: ContentInterface, index: number) => (
                <SwiperSlide key={index}>
                    <div className="find-items">
                        <div className="col-10 col-md-6 m-auto">
                            <SharedImage
                                fallbackSrc={item.image_path}
                                thumpSrc={item.thump_path}
                                imageSize='image_large'
                                src={item.thump_path}
                                className="w-100"
                                alt={item.title}
                                aspect={'16/9'}
                                height={600}
                                width={1000}
                            />
                        </div>
                        <div className="find-items-name text-center mt-3">
                            <h2 className="text-white fa-3x">{item.title}</h2>
                            <div className="text-white w-50 m-auto text-justify fs-20px mt-4">
                                {formatSummary(item.summary).map((line, idx) => (
                                    <div className="text-over o3" key={idx}>
                                        {line}
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="find-items-more text-center mt-4 w-fit border-radius-14px m-auto py-2">
                            <a
                                href={`/products/${item.id}/${item.title.trim().replace(/\s+/g, '-')}`}
                                className="text-light text-decoration-underline fs-20px py-2 px-5"
                            >
                                اطلاعات بیشتر
                            </a>
                        </div>
                    </div>
                </SwiperSlide>
            ))}

            <div ref={prevRef} className={style['swiper-button-prev']}>
                <i className="fa fa-angle-left fs-28px"></i>
            </div>
            <div ref={nextRef} className={style['swiper-button-next']}>
                <i className="fa fa-angle-right fs-28px"></i>
            </div>
        </Swiper>
    );

    return (
        <div className={style['find'] + ' py-5'}>
            <div className="container pt-5 pb-3">
                <div className="find-category d-flex align-items-center justify-content-center mt-4">
                    <SharedFilterCategory
                        variant="find"
                        data={category.group.active_categories}
                        activeId={activeCategory}
                        onSelect={handleSelect}
                        onStartLoading={startLoading}
                    />
                </div>
            </div>

            <div className="find-slider mt-5">
                {isLoading ? (
                    // 🔄 حالت لودینگ
                    <div className="find-items">
                        <div className="w-50 m-auto">
                            <div
                                style={{
                                    aspectRatio: 3,
                                    backgroundColor: '#333',
                                    borderRadius: '12px',
                                }}
                                className="loading-motion"
                            ></div>
                        </div>
                        <div className="find-items-name text-center mt-3">
                            <h2
                                className="text-white fa-3x loading-motion"
                                style={{
                                    backgroundColor: '#555',
                                    borderRadius: '6px',
                                    width: '250px',
                                    margin: '0 auto',
                                    height: '1em',
                                }}
                            ></h2>
                            <p
                                className="text-white loading-motion"
                                style={{
                                    backgroundColor: '#555',
                                    borderRadius: '6px',
                                    width: '150px',
                                    margin: '20px auto',
                                    height: '1.5em',
                                }}
                            ></p>
                        </div>
                        <div className="find-items-more text-center mt-4 w-fit border-radius-14px m-auto py-2">
                            <div
                                className="loading-motion"
                                style={{
                                    backgroundColor: '#555',
                                    borderRadius: '6px',
                                    width: '120px',
                                    height: '50px',
                                    margin: '0 auto',
                                }}
                            ></div>
                        </div>
                    </div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center text-light py-5 fs-5">
                        هیچ داده‌ای برای این دسته‌بندی موجود نیست!
                    </div>
                ) : (
                    renderActualSlider()
                )}
            </div>
        </div>
    );
}
