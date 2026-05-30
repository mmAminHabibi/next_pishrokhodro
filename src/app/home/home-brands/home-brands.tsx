"use client";

import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import SharedTitle from "@/app/shared/shared-title/shared-title";
import Image from "next/image";
import './home-brands.scss'
import Link from "next/link";
interface propsType {
    data:BlockCategoryInterface;
}
export default function HomeBrands({data}: propsType) {
    return (
        <div className="py-5 brands">
            <div className='container-lg'>
                <SharedTitle title={'برند ها'} full={false}/>
                <Swiper
                    modules={[Pagination, Navigation]}
                    loop={true}
                    speed={10}
                    spaceBetween={90}
                    slidesPerView={6}
                    autoplay={{delay: 2000, disableOnInteraction: false}}
                    breakpoints={{
                        320: {slidesPerView: 2, spaceBetween: 10},
                        576: {slidesPerView: 3, spaceBetween: 15},
                        768: {slidesPerView: 4, spaceBetween: 20},
                        992: {slidesPerView: 5, spaceBetween: 25},
                        1200: {slidesPerView: 6, spaceBetween: 30},
                    }}
                >
                    {data.group?.active_categories.map((item: BlockCategoryItemInterface, index: number) => (
                        // <SwiperSlide key={index}>
                        //     <div
                        //         className="w-100 h-100 aspect-ratio-1 d-flex align-items-center justify-content-center">
                        //         <Link href={item.description || ''}>
                        //             <Image
                        //                 src={item.image_path}
                        //                 alt={item.title}
                        //                 className="aspect-ratio-1 w-100 object-fit-contain brands-image"
                        //                 width={130}
                        //                 height={130}
                        //             />
                        //         </Link>
                        //     </div>
                        // </SwiperSlide>
                        <div key={index}
                            className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <Link href={item.description || ''}>
                                <Image
                                    src={item.image_path}
                                    alt={item.title}
                                    className="aspect-ratio-1 w-100 object-fit-contain brands-image"
                                    width={130}
                                    height={130}
                                />
                            </Link>
                        </div>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}