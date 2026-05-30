"use client";

import style from "./home-slider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import SharedImage from "@/app/shared/shared-image/shared-image";
import { useRef, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HomeSlider({ data }: { data: BlockInterface }) {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const paginationRef = useRef<HTMLDivElement | null>(null);
    const [swiperReady, setSwiperReady] = useState(false);

    useEffect(() => {
        setSwiperReady(true);
    }, []);
    if (!data || !data.block || !data.contents?.data?.length) {
        return null;
    }
    return (
        <div className={`${style["home-slider"]} position-relative overflow-hidden`}>
            <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                loop={true}
                speed={800}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{
                    el: paginationRef.current,
                    clickable: true,
                }}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                }}

                className="swiper-container"
            >
                {data?.contents?.data.map((item: ContentInterface, index: number) => (
                    <SwiperSlide key={index}>
                        <div className="position-relative">
                            <SharedImage
                                className="w-100 position-relative"
                                fallbackSrc={item.image_path}
                                thumpSrc={item.thump_path}
                                imageSize={"image_large"}
                                src={item.thump_path}
                                aspect={"16/7"}
                                width={1900}
                                alt="slide"
                            />

                            {item.summary && (
                                <a
                                    href={item.summary}
                                    className="position-absolute text-white border-radius-14px bottom-0 end-0 mb-lg-3 mb-2 me-3 fs-lg-20px fs-12px py-2 px-lg-4 px-2 d-flex align-items-center gap-2 bg-btn"
                                    style={{ zIndex: 10 }}
                                >
                                    اطلاعات بیشتر
                                    <i className="fa fa-angle-left"></i>
                                </a>
                            )}
                        </div>
                    </SwiperSlide>
                ))}

                <button
                    ref={prevRef}
                    className={`${style["custom-nav"]} ${style["custom-prev"]} d-flex align-items-center justify-content-center bg-white border-0`}
                >
                    <i className="fa fa-angle-left fs-28px"></i>
                </button>

                <button
                    ref={nextRef}
                    className={`${style["custom-nav"]} ${style["custom-next"]} d-flex align-items-center justify-content-center bg-white border-0`}
                >
                    <i className="fa fa-angle-right fs-28px"></i>
                </button>


                {/* دات‌های pagination */}
                <div ref={paginationRef} className={`${style["custom-pagination"]} custom-pagination`}></div>
            </Swiper>
        </div>
    );
}
