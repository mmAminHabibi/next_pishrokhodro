import style from './include-footer.module.scss';
import Link from "next/link";
import { FormContact } from "@/app/shared/shared-form";
import {FooterInterface} from "./footer.interface"

interface Footer {
    data : FooterInterface
}
export default async function IncludeFooter({data} : Footer) {
    const resources = data.data.resources_footer?.menu?.[0];
    const selling = data.data.selling_footer?.menu?.[0];
    const copy = data.data.copy_right?.menu?.[0];
    const form = data.data.form_footer?.form_type;
    const enamad = data.site.meta_tags[0].body

    return (
        <footer className={`${style['footer']} py-5 bg-light`}>
            <div className="container-lg">
                <div className="row px-lg-0 px-3 gy-4 justify-content-between">
                    <div className="col-12 col-md-5">
                        {form && (
                            <>
                                <h6 className="fw-bold mb-3 px-lg-0 px-1">{form.title}</h6>
                                <FormContact isRegistration={false} formId={form.id} data={form.fields} variant="footer"/>
                            </>
                        )}
                    </div>

                    <div className="col-12 col-md-7">
                        <div className="row px-lg-0 px-2">
                            {resources && (
                                <div className="col-6 col-md-4">
                                    <h6 className="fw-bold mb-3">{resources.title}</h6>
                                    <ul className="list-unstyled">
                                        {resources.all_active_menus.map((item: ContentInterface, index) => (
                                            <li key={index}>
                                                <Link href={item.link}>{item.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {selling && (
                                <div className="col-6 col-md-4">
                                    <h6 className="fw-bold mb-3">{selling.title}</h6>
                                    <ul className="list-unstyled">
                                        {selling.all_active_menus.map((item: ContentInterface, index) => (
                                            <li key={index}>
                                                <Link href={item.link}>{item.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="col-12 col-md-4 d-flex justify-content-lg-start justify-content-center">
                                <div dangerouslySetInnerHTML={{__html: enamad}}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between mt-4 pt-3 border-top">
                    <div className="text-center text-md-start mt-4 mt-md-0 order-2 order-lg-1">
                        <p>© 2025 کلیه حقوق برای پیشرو خودرو ویدا محفوظ است | طراحی: <a href="https://poyeshgaran.ir/">پویشگران عصر داده</a></p>
                    </div>
                    <div
                        className="order-1 order-lg-2 d-flex flex-wrap align-items-center justify-content-center justify-content-lg-end">
                        {copy?.all_active_menus?.map((item: ContentInterface, index: number) => (
                            <Link key={index} href={item.link} className="mx-3">{item.title}</Link>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}
