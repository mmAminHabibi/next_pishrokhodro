'use client';

import style from './home-service.module.scss'
import SharedTitle from "@/app/shared/shared-title/shared-title";
import Image from "next/image";

export default function HomeService({data}: { data: BlockInterface }) {
    if (!data || !data.block || !data.contents?.data?.length) {
        return null;
    }

    return (
        <div className={style['home-service'] + ' py-5 bg-color'}>
            <div className={' container-lg my-5'}>
                <SharedTitle title={data?.contents?.data?.[0].title} full={false}/>
                <div className="row mt-4">
                    {data?.contents?.data?.[0]?.files?.map((item: ContentFileInterface, index: number) => {
                        let href = '#'
                        switch(item.id) {
                            case 1423:
                                href = '/contact';
                                break;
                            case 1425:
                                href = '/onlineSales';
                                break;
                            case 1424:
                                href = '/login?fallback=veteran-registration';
                                break;
                            case 1426:
                                href = '/warranty?category_id=340';
                                break;
                            default:
                                href = '#';
                        }

                        return (
                            <div key={index} className="col-lg-3 col-md-6 col-12">
                                <div className="w-100 h-100 p-1">
                                    <a href={href}>
                                        <div className={style['home-service-item'] + ' h-100'}>
                                            <div className="home-service-item p-4 h-100 bg-white position-relative border-radius-14px">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Image src={item.file.file_path} alt={item.title} width={40} height={40}/>
                                                </div>
                                                <div>
                                                    <h3 className='fs-20px first-color my-2 fw-bold'>{item.title}</h3>
                                                    <p className='fs-18px text-color mb-0'>{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}