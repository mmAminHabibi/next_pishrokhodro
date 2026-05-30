'use client';

import { useEffect, useState } from 'react';
import style from './home-feedback.module.scss';
import Image from 'next/image';
import SharedTitle from '@/app/shared/shared-title/shared-title';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export default function HomeFeedback({ data }: { data: BlockInterface }) {
    // وقتی mounted=true می‌شود، محتوای داینامیک رندر می‌گردد
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!data || !data.block || !data.contents?.data?.length) {
        return null;
    }
    return (
        <div className={style['home-feedback'] + ' py-5'}>
            <div className="container-lg">
                <SharedTitle title={data.block.title} full={false} />
                <div className="mt-5 w-100">
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        speed={20}
                        centeredSlides={true}
                        spaceBetween={18}
                        slidesPerView={3}
                        initialSlide={1}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 8 },
                            700: { slidesPerView: 3 },
                        }}
                    >
                        {data.contents.data.map((item: ContentInterface, index: number) => (
                            <SwiperSlide key={index}>
                                <div className="w-100">
                                    <div
                                        className={
                                            style['home-feedback-item'] +
                                            ' p-4 bg-white d-flex flex-column gap-3'
                                        }
                                    >
                                        <div
                                            className={
                                                style['home-feedback-item-profile'] +
                                                ' d-flex align-items-center gap-3'
                                            }
                                        >
                                            <div>
                                                <Image
                                                    src={item.image_path}
                                                    alt="feedback"
                                                    className="object-fit-cover"
                                                    width={56}
                                                    height={56}
                                                />
                                            </div>
                                            <div className="d-flex align-items-start gap-2 flex-column">
                                                <h4 className="fs-18px fw-bold first-color mb-0">
                                                    {item.title}
                                                </h4>
                                                <p className="fs-16px text-color mb-0"  dangerouslySetInnerHTML={{__html: item.summary}}></p>
                                            </div>
                                        </div>

                                        <div>
                                            {mounted ? (
                                                item.body?.trim() ? (
                                                    <p
                                                        className="fs-18px mb-0"
                                                        dangerouslySetInnerHTML={{ __html: item.body }}
                                                    />
                                                ) : (
                                                    <p className="fs-18px mb-0 text-muted">— بدون متن —</p>
                                                )
                                            ) : (
                                                <p className="fs-18px mb-0">&nbsp;</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
