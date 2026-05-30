import style from './home-banner.module.scss'
import SharedImage from "@/app/shared/shared-image/shared-image";

interface bannerHome {
    data : ContentInterface
}
export default function HomeBanner({ data } : bannerHome) {
    if (!data || !data.title || !data.image_path || !data.summary || !data.thump_path) {
        return null;
    }
    return(
        <div className={style['home-banner'] + ''}>
            <div className="container-fluid px-0 py-5 overflow-hidden">
                <div className="row gx-md-0">
                    <div className="col-12 col-md-6 ">
                        <div className={style['home-banner-content'] + ' h-100 px-3 px-md-0 pb-3 pb-md-0 d-flex flex-column justify-content-center align-items-center '}>
                            <div className="col-md-8 h-100 d-flex flex-column justify-content-center ">
                                <h3 className={'fs-24px first-color fw-bold'}>{ data.title }</h3>
                                <p className="fs-18px text-color "  dangerouslySetInnerHTML={{__html: data.summary}}></p>
                                <div className="d-flex justify-content-end">
                                    <a href="tel:02147000740" className={'fs-18px py-1 px-3 first-color position-relative overflow-hidden'}>دریافت مشاوره</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 ">
                        <div className={style['home-banner-image'] + ' overflow-hidden'}>
                            <SharedImage thumpSrc={data.thump_path}  src={data.thump_path} fallbackSrc={data.image_path} alt={'test'} aspect={'16/7'} width={751} height={328}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}