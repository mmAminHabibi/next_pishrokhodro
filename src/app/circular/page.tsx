import {getApiService} from "@/core/http";
import "./slider.scss"
import Catalog from "@/app/products/[id]/[title]/catalog";
import SharedImage from "@/app/shared/shared-image/shared-image";
import {GetItemLink} from "@/core/helper";
import SharedTitle from "@/app/shared/shared-title/shared-title";
import ServerError from "@/app/server-error/server-error";
import Loading from "@/app/loading";

interface FieldsInterface {
    text: string,
    title: string,
    field_type_id: number,
    value:number
}

export default async function Article(){
    let data: PageInterface | null = null;

    try {
        data = await getApiService("circular");
    } catch (error) {
        return <ServerError />;
    }

    if (!data || !data.data?.circular?.contents?.data?.[0]) {
        return <Loading />;
    }
    const circular = data.data.circular.contents.data
    // const fields: Record<string, FieldsInterface> = JSON.parse(circular.fields);
    return(
        <>
            <div className="container py-5">
                <SharedTitle title={'بخشنامه و اطلاعیه فروش'} full={true}/>
                <div className="circular mt-5">
                    <div className="row">
                        {
                            circular.map((item, index) => {
                                return (
                                    <div className="col-lg-6 col-12 mb-lg-0 mb-4" key={index}>
                                        <div className="circular-box border-radius-14px bg-btn h-100">
                                            <div className="circular-box-image">
                                                <SharedImage
                                                    imageSize={'image_normal'}
                                                    className={'border-radius-14px'}
                                                    src={item.image_path}
                                                    alt={item.title}
                                                    aspect={'16/9'}
                                                />
                                            </div>
                                            <div className="circular-box-title mt-2 p-3 d-flex flex-column justify-content-between">
                                                <h1 className="fs-28px"><a href={GetItemLink(item)} className={'text-black text-white'}>{ item.title }</a></h1>
                                                <a  href={GetItemLink(item)} className={'btn border-radius-14px text-white w-fit bg-second-color px-4 py-2'}>
                                                    اطلاعات بیشتر
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/*<div className="mt-5">*/}
                    {/*    <CircularSlider data={circular} />*/}
                    {/*</div>*/}
                    {/*<div className="circular-info mt-5 fs-26px first-color fw-600" dangerouslySetInnerHTML={{ __html: circular.body }}></div>*/}
                    <div className="circular-catalog">
                        {/*<Catalog fields={fields}/>*/}
                    </div>
                </div>
            </div>
        </>
    )
}