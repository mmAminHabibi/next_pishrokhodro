import style from './home-product-item.module.scss'
import SharedImage from "@/app/shared/shared-image/shared-image";

interface HomeProductItemProps {
    item: ContentInterface;
}
export default function HomeProductItem({item}: HomeProductItemProps) {

    // let specs: { title: string; value: string }[] = [];
    //
    // try {
    //     specs = JSON.parse(item.fields);
    // } catch (error) {
    //     console.error("Error parsing item.fields:", error);
    // }

    return (
        <div className={style['home-product-card'] + ' position-relative'}>
            <div className="row">
                <div className="col-12 col-md-6 d-none d-md-block">
                    <div className={style['home-product-card-title'] + " fs-22px"}>
                        <div className="position-relative">
                            { item.title }
                            <p className={'mb-0'}  dangerouslySetInnerHTML={{__html: item.summary}}></p>
                        </div>
                    </div>
                </div>
                <div className="col-12 position-relative">
                    <div className="row">
                        <div className="col-md-5 order-last order-md-first">
                            <div className={style['home-product-card-info'] + ' bg-white p-3 p-md-0'}>
                                <div className={" fs-22px d-block d-md-none"}>
                                    <div className="position-relative">
                                        این محصول است
                                        <p className={'mb-0'}>موجد</p>
                                    </div>
                                </div>

                                {/*<ul className="d-flex flex-column gap-2 w-100 p-0 pt-3">*/}
                                {/*    <li className="d-flex align-items-center justify-content-between fs-20px">*/}
                                {/*        <span className='text-color'>{ specs.model_year.title } :</span>*/}
                                {/*        <span className='first-color'>{ specs.model_year.value }</span>*/}
                                {/*    </li>*/}
                                {/*    <li className="d-flex align-items-center justify-content-between fs-20px">*/}
                                {/*        <span className='text-color'>{ specs.model.title } :</span>*/}
                                {/*        <span className='first-color'>{ specs.model.value }</span>*/}
                                {/*    </li>*/}
                                {/*    <li className="d-flex align-items-center justify-content-between fs-20px">*/}
                                {/*        <span className='text-color'>{ specs.fuel.title } :</span>*/}
                                {/*        <span className='first-color'>{ specs.fuel.value }</span>*/}
                                {/*    </li>*/}
                                {/*</ul>*/}

                                {/*<p className="fw-bold fs-20px first-color text-center my-4">{ specs.price.value }</p>*/}
                                <div ></div>
                                <a href={`/products/${item.id}/${item.title.trim().replace(/\s+/g, '-')}`}
                                   className={'d-flex align-items-center justify-content-between w-100 px-3 py-2 fs-18px '}>
                                    سفارش
                                    <i className="fa fa-angle-left"></i>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-7 order-first order-md-last">
                            <div className={style['home-product-card-image'] + ' overflow-hidden'}>
                                <a href={`/products/${item.id}/${item.title.trim().replace(/\s+/g, '-')}`}>
                                    <SharedImage src={item.image_path} alt={'car'} aspect={'3/2'}/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}