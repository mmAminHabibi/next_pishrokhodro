import style from './contact.module.scss'
import SharedTitle from "@/app/shared/shared-title/shared-title";
import {ContactPageInterface} from './contact.interface'
import Button from "@/app/contact/button";
import {getApiService} from "@/core/http";
import Loading from "@/app/loading";
import ServerError from "@/app/server-error/server-error";

// class ContentFileInterface {
// }

export default async function ContactPage() {
    let data: ContactPageInterface | null = null;

    try {
        data = await getApiService('contact_us');
    } catch (error) {
        return <ServerError />;
    }

    if (!data || !data.data?.information?.contents?.data?.[0]) {
        return <Loading />;
    }
    const info = data?.data?.information?.contents.data[0];

    return (
        <>
            {!data && <Loading/>}
            <div className={style['contact'] + ' container-lg py-5'}>
                <div className="row">
                    <div className="col-12 mb-4">
                        <SharedTitle title={'ارتباط باما'} full={true}/>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className={style['contact-info'] + ' h-100 px-4 py-5 bg-color border-radius-14px'}>
                            <h2 className={'fs-24px fw-bold first-color mb-3'}>{info.title}</h2>
                            <ul className={'list-style-none p-0 d-flex flex-column gap-4'}>
                                {
                                    info.files.map((item: ContentFileInterface, index: number) => (
                                        <li key={index}>
                                            <a className={'d-flex gap-3 justify-content-between text-color align-items-center flex-wrap'}
                                               href="">
                                                <span className="d-flex align-items-center gap-2"><i
                                                    className="fa fa-phone first-color"></i>{item.title}</span>
                                                {item.description}
                                            </a>
                                        </li>
                                    ))
                                }
                                <div className="">
                                    تماس
                                    <div className="d-flex flex-wrap align-content-center justify-content-between mt-3">
                                        <a className="first-color" href="tel:02147000740">02147000740</a>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-8 mt-lg-0 mt-4">
                        <div>
                            <Button data={data.data.contact_form.form_type}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}