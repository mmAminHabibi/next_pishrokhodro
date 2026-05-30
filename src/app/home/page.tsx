import HomeSlider from "@/app/home/home-slider/home-slider";
import HomeBrands from "@/app/home/home-brands/home-brands";
import HomeService from "@/app/home/home-service/home-service";
import HomeBanner from "@/app/home/home-banner/home-banner";
import HomeFeedback from "@/app/home/home-feedback/home-feedback";
import {getApiService} from "@/core/http";
import HomeBlogs from "@/app/home/home-blogs/home-blogs";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import Loading from "@/app/loading";
import HomeFind from "@/app/home/home-find/home-find";
import { ApiError } from "@/core/api-error";
import ServerError from "@/app/server-error/server-error";

export default async function Home() {
    let data: HomePageInterface | null = null;

    try {
        data = await getApiService("main_page");
    } catch (error) {
        if (error instanceof ApiError && error.status === 429) {
            return <ServerError />;
        }
        throw error;
    }
    if (!data || !data.data) {
        return <Loading />;
    }
    return (
        <div>
            <HomeSlider   data={data.data.slider_home} />
            <HomeService  data={data.data.servies_home}/>
            <HomeFind     category={data.data.car_type} />
            {/*<HomeProduct  data={data.data.products_home}/>*/}
            <HomeBanner   data={data.data.banner_home.contents.data[0]}/>
            <HomeFeedback data={data.data.comments_home}/>
            <HomeBrands   data={data.data.brands_home} />
            <HomeBlogs    data={data.data.blogs_home}/>
        </div>
    )
}
