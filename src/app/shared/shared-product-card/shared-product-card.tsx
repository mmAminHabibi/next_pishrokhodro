import style from './shared-product-card.module.scss'
import SharedImage from "@/app/shared/shared-image/shared-image";
import {GetItemLink} from "@/core/helper";
import Link from "next/link";

interface product {
    data: ContentInterface | null
}

interface FieldsInterface {
    text: string,
    title: string,
    field_type_id: number
}

export default function SharedProductCard({data}: product) {
    let comingSoonCar: boolean = false;
    if (Array.isArray(data?.categories)) {
        const index = data.categories.findIndex(cat => cat.id === 63);
        if (index !== -1) {
            data.categories.splice(index, 1);
            comingSoonCar = true;
        } else {
            comingSoonCar = false;
        }
    }

    return (
        <>
            {data !== null ? (
                <div className="mb-3">
                    <div
                        className={style['shared-product-card'] + ' position-relative bg-white h-100 d-flex flex-column justify-content-between'}>
                        <div className={style['shared-product-card-image'] + ' overflow-hidden position-relative'}>
                            {data.categories[1].title === 'واردات جانبازی' && (
                                <div
                                    className={style['shared-product-card-image-sacrifice'] + ' position-absolute'}>
                                    <span className="text-white">{data.categories[1].title}</span>
                                </div>
                            )}
                            {comingSoonCar && (
                                <div
                                    className={style['shared-product-card-image-coming'] + ' position-absolute m-2 end-0 top-0 px-2 py-1 fs-14px'}>
                                    <span className="">به زودی</span>
                                </div>
                            )}

                            <Link href={GetItemLink(data)}>
                                <SharedImage imageSize={'image_normal'} thumpSrc={data.thump_path}
                                             src={data.thump_path} fallbackSrc={data.image_path} alt={'car'}
                                             aspect={'16/7'}/>
                            </Link>
                        </div>
                        <div className="p-3">
                            <div className={" fs-22px"}>
                                <h4 className="mb-3">
                                    <Link
                                        className={'fs-22px first-color fw-bold text-over o1'}
                                        href={GetItemLink(data)}>
                                        {data.title}
                                    </Link>
                                </h4>
                            </div>
                            <div className={style['shared-product-card-info']}>
                                <Link href={GetItemLink(data)}
                                      className={'d-flex align-items-center justify-content-between w-100 px-3 py-2 fs-18px '}>
                                    اطلاعات بیشتر
                                    <i className="fa fa-angle-left"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <SharedProductCardLoading/>
            )}
        </>

    )
}

function SharedProductCardLoading() {
    return (
        <div className={style['shared-product-card'] + ' position-relative bg-white'}>
            <div className="p-1">
                <div
                    className={style['shared-product-card-image'] + ' overflow-hidden loading-motion aspect-ratio-16-9'}></div>
            </div>
            <div className="p-3">
                <div className={" fs-22px"}>
                    <h4 className="mb-0 fs-22px first-color fw-bold loading-motion w-75">
                        loading
                    </h4>
                </div>
                <div className={style['shared-product-card-info']}>
                    <p className="fw-bold fs-20px first-color text-center my-4 loading-motion w-50 m-auto">loading</p>
                    <a href=""
                       className={'d-flex align-items-center justify-content-between w-100 px-3 py-2 fs-18px loading-motion'}>
                        سفارش
                        <i className="fa fa-angle-left"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}