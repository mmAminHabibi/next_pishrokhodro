'use client';

import style from './home-blogs.module.scss'
import SharedBlogCard from "@/app/shared/shared-blog-card/shared-blog-card";
import SharedTitle from "@/app/shared/shared-title/shared-title";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";

export default function HomeBlogs({data} : {data:BlockInterface}) {
    if (!data || !data.block || !data.contents?.data?.length) {
        return null;
    }
    return (
        <div className={style['home-blogs'] + ' bg-color'}>
            <div className="container-lg py-5">
                <div className="row">
                    <div className="col-12 mb-5">
                        <SharedTitle title={'بلاگ ها'}/>
                    </div>
                </div>
                <div className="w-100">
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        speed={20}
                        spaceBetween={24}
                        slidesPerView={3}
                        initialSlide={1}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 18
                            },
                            700: {
                                slidesPerView: 3
                            }

                        }}
                    >
                        {
                            data.contents.data.map((item : ContentInterface , index : number) => (
                                <SwiperSlide key={index}><SharedBlogCard item={item}/></SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>
            </div>
        </div>
    )
}