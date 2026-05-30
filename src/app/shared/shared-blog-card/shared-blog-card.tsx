import style from './shared-blog-card.module.scss'
import SharedImage from "@/app/shared/shared-image/shared-image";
import Link from "next/link";
import {GetItemLink} from "@/core/helper";

interface blog {
    item: ContentInterface,
    loading?: boolean
}

export default function SharedBlogCard({item, loading}: blog) {
    if (loading && !item) {
        return <SharedBlogCardLoading/>
    }
    return (
        <>
            <div
                className={style['shared-product-card'] + ' position-relative bg-white d-flex flex-column justify-content-between'}>
                <div className={style['shared-product-card-image'] + ' overflow-hidden'}>
                    <Link href={GetItemLink(item)}>
                        <SharedImage
                            src={item.thump_path}
                            fallbackSrc={item.image_path}
                            thumpSrc={item.thump_path}
                            alt={item.title}
                            imageSize={'image_normal'}
                            aspect={'16/9'}/>

                    </Link>
                </div>
                <div className="p-3">
                    <div className={" fs-22px"}>
                        <h4 className="mb-3 ">
                            <Link href={GetItemLink(item)} className={'fs-22px first-color fw-bold text-over o1'}>
                                {item.title}
                            </Link>
                        </h4>
                        <p className="text-color text-over o4 fs-18px "  dangerouslySetInnerHTML={{__html: item.summary}}></p>
                    </div>
                    <div className={style['shared-product-card-info']}>
                        <Link href={GetItemLink(item)}
                              className={'d-flex ms-auto align-items-center justify-content-between px-3 py-2 fs-18px w-fit gap-3'}>
                            اطلاعات بیشتر
                            <i className="fa fa-angle-left"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </>

    )
}

function SharedBlogCardLoading() {
    return (
        <div className={style['shared-product-card'] + ' position-relative bg-white'}>
            <div
                className={style['shared-product-card-image'] + ' overflow-hidden loading-motion aspect-ratio-16-9 '}></div>
            <div className="p-3">
                <div className={" fs-22px"}>
                    <h4 className="mb-3 fs-22px first-color fw-bold loading-motion w-75">loading</h4>
                    <p className="text-color text-over o4 fs-18px d-flex flex-column gap-1">
                        <span className="loading-motion w-100">loading</span>
                        <span className="loading-motion w-100">loading</span>
                        <span className="loading-motion w-100">loading</span>
                        <span className="loading-motion w-25 ">loading</span>
                    </p>
                </div>
                <div className={style['shared-product-card-info']}>
                    <a
                        className={'d-flex ms-auto align-items-center justify-content-between px-3 py-2 fs-18px w-fit gap-3 loading-motion w-25'}>
                        سفارش
                        <i className="fa fa-angle-left"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}