import style from './products-details.module.scss'
import {getContent, getContentAttachment} from "@/core/http";
import SharedImage from "@/app/shared/shared-image/shared-image";
import SharedCircleProgress from "@/app/shared/shared-circle-progress/shared-circle-progress";
import ProductDetailsGallery from "@/app/products/[id]/[title]/products-details-gallery/products-details-gallery";
import ProductsDetailsInfo from "@/app/products/[id]/[title]/products-details-info/products-details-info";
import SeoHead from "@/core/seo-head";
import Image from "next/image";
import Catalog from "@/app/products/[id]/[title]/catalog";
import ServerError from "@/app/server-error/server-error";
import Loading from "@/app/loading";
import {ApiError} from "@/core/api-error";

interface ContentServiceInterface {
    content: ContentInterface
}

interface FieldsInterface {
    text: string,
    title: string,
    field_type_id: number,
    value: number
}

interface PropsType {
    params: Promise<{ id: string }>,
    paramsSearch?: Promise<object>,
}

export default async function ProductsDetails(props: PropsType) {
    const { id } = await props.params;

    let data: ContentServiceInterface | null = null;

    try {
        data = await getContent(id);
    } catch (error) {
        if (error instanceof ApiError && error.status === 429) {
            return <ServerError />;
        }
        throw error;
    }

    if (!data || !data.content) {
        return <Loading />;
    }
    const content = data.content
    const fields: Record<string, FieldsInterface> = JSON.parse(content.fields);
    let comingSoonCar: boolean = false;
    if (Array.isArray(data?.content.categories)) {
        const index = data?.content.categories.findIndex((cat: ContentCategoryInterface) => cat.id === 63);
        if (index !== -1) {
            data?.content.categories.splice(index, 1);
            comingSoonCar = true;
        } else {
            comingSoonCar = false;
        }
    }

    return (
        <div className={style['products-details']}>
            <SeoHead post={content}/>

            {content?.pictures?.banner?.thump_path && (
                <div
                    className={style['products-details-banner'] + ' d-flex flex-column justify-content-start position-relative overflow-hidden'}>
                    <SharedImage
                        width={1900}
                        height={800}
                        imageSize="image_large"
                        src={content.pictures.banner?.thump_path}
                        thumpSrc={content.pictures.banner?.thump_path}
                        fallbackSrc={content.pictures.banner?.file_path}
                        alt={content.pictures.banner?.title}/>
                    <div className="d-flex gap-3 position-absolute m-3 bottom-0">

                        <div className='catalog '>
                            {fields.Pro_catalog.text && <Catalog fields={fields}/>}
                            {!fields.Pro_catalog.text && ''}
                        </div>
                        {comingSoonCar && (
                            <div className={style['catalog']}>
                                <p
                                    className="mb-0 btn bg-btn d-flex align-items-center text-light justify-content-center gap-2"
                                >
                                    به زودی
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="container-lg py-5">
                <div className="row gx-md-5">
                    <div className="col-12 col-md-7">
                        <div className={style['products-details-content']}>

                            <h3 className="first-color fs-36px fw-bold mb-3">
                                {content.title}
                            </h3>
                            <p className="text-color fs-20px text-justify " dangerouslySetInnerHTML={{__html: content.summary}}></p>
                        </div>
                    </div>

                    <div className="col-12 col-md-5">
                        <div
                            className={style['products-details-content-image'] + ' d-flex align-items-center justify-content-center overflow-hidden border-radius-14px'}>
                            <SharedImage
                                width={450}
                                height={320}
                                src={content.thump_path}
                                fallbackSrc={content.image_path}
                                thumpSrc={content.thump_path}
                                alt={content.title}
                                imageSize={'image_normal'}
                            />
                        </div>
                    </div>
                </div>

                <div className="row justify-content-between py-5 gy-4 ">
                    {Object.entries(fields).map(([key, value]) => {
                        if (value.field_type_id !== 3) return null;
                        if (!value.text || value.text.trim() === '') return null;
                        return (
                            <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={key}>
                                <div className="d-flex flex-column gap-3 justify-content-center">
                                    <div className="px-4 px-sm-5">
                                        <SharedCircleProgress step={Number(value.text) * 10}/>
                                    </div>
                                    <p className="fs-18px first-color mb-0 text-center">
                                        {cleanLabel(value.title)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div
                    className={style['products-details-content-info'] + ' fs-20px text-justify text-color'}
                    dangerouslySetInnerHTML={{__html: content.body}}>

                </div>
            </div>
            <div className="container-fluid px-0 py-5">
                <ProductDetailsGallery files={content.files}/>
            </div>

            <div className="container-lg py-5">
                <ProductsDetailsInfo sections={content.sections}/>
            </div>

        </div>
    );
}

function cleanLabel(label: string): string {
    return label.replace(/\s*\(.*?\)\s*/g, "").trim();
}