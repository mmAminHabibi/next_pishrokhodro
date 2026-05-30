import { getApiService } from "@/core/http";
import "../[content]/content.scss";
import './call.scss'
import { FormContact } from "@/app/shared/shared-form";
import {CallInterface} from "@/app/call/call.interface";
import ServerError from "@/app/server-error/server-error";
import Loading from "@/app/loading";
export default async function Call() {
    let data: CallInterface | null = null;

    try {
        data = await getApiService("vehicle_recall");
    } catch (error) {
        return <ServerError />;
    }

    if (!data || !data.data?.call?.form_type) {
        return <Loading />;
    }

    const call = data.data.call.form_type;
    return (
        <>
            <div className="container py-5">
                <div className="call">
                    <div className="call-info">
                        <h4 className="fa-3x">{ call.title }</h4>
                        <p className="fs-20px">{ call.description }</p>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-12 col-12 order-lg-1 order-2 mt-lg-0 mt-3 px-4">
                            <FormContact isRegistration={false} formId={call.id} data={call.fields} />
                        </div>
                        {/*<div className="col-md-6 col-12 order-lg-2 order-1">*/}
                        {/*    <SharedImage className="border-radius-14px" aspect={'3/2'} src={'/images/namikhodro_car_card.webp'} alt={'images'} />*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </>
    );
}
