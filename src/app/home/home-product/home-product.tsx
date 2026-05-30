'use client';

import style from './home-product.module.scss'
import SharedTitle from "@/app/shared/shared-title/shared-title";
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react"
import SharedProductCard from "@/app/shared/shared-product-card/shared-product-card";

export default function HomeProduct({data}: { data: BlockInterface }) {
    return (
        <div className={style['home-product'] + ' py-5'}>
            <div className="container-fluid px-md-5 px-3">

                <SharedTitle title={'محصولات'} full={false}/>
                <div className="w-100">
                    <Swiper
                        modules={[Pagination, Navigation]}
                        speed={20}
                        breakpoints={{
                            576: { slidesPerView: 1, spaceBetween: 15 },
                            700: { slidesPerView: 3, spaceBetween: 15 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                        }}
                    >
                        {data.contents.data.map((item: ContentInterface, index: number) => (
                            <SwiperSlide key={index}>
                                <div className="w-100">
                                    <SharedProductCard data={item}/>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </div>
    )
}