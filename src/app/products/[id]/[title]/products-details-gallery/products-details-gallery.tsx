'use client'

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import style from './products-details-gallery.module.scss'
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SharedImage from "@/app/shared/shared-image/shared-image";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import React from "react";

interface PropsType {
    files: ContentFileInterface[];
}

export default function ProductDetailsGallery({ files }: PropsType) {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    // const [useOriginal, setUseOriginal] = React.useState(false);
    const useOriginal:boolean = false
    return (
        <div className={style['products-details-gallery'] + ' px-md-3'}>
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                speed={20}
                centeredSlides={true}
                spaceBetween={48}
                slidesPerView={3}
                initialSlide={0}
                loop={true}
                breakpoints={{
                    0: { slidesPerView: 1.5, spaceBetween: 18 },
                    700: { slidesPerView: 3 },
                }}
            >
                {files.map((item, i:number) => (
                    <SwiperSlide key={i}>
                        <div className="py-4">
                            <div
                                className={
                                    style['products-details-gallery-item'] +
                                    " products-details-gallery-item d-flex align-items-center justify-content-center overflow-hidden border-radius-14px cursor-pointer"
                                }
                                onClick={() => { setIndex(i); setOpen(true); }}
                            >
                                <SharedImage
                                    width={750}
                                    height={560}
                                    src={item.file.thump_path}
                                    fallbackSrc={item.file.file_path}
                                    thumpSrc={item.file.thump_path}
                                    imageSize={'image_normal'}
                                    alt={item.title}
                                    aspect={'16/9'}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={files.map((f: ContentFileInterface , i:number) => ({ src: f.file.file_path , key: i }))}
                plugins={[Thumbnails]}
                render={{
                    buttonClose: () => (
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: "#dba681",
                                border: "none",
                                color: "#fff",
                                fontSize: "24px",
                                width: "50px",
                                height: "40px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                lineHeight: "40px",
                                textAlign: "center",
                                zIndex: 10000
                            }}
                        >
                            ×
                        </button>
                    )
                }}
            />
        </div>
    )
}
