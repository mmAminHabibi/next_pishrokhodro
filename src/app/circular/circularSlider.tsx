// 'use client';
//
// import { Autoplay, Pagination } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SharedImage from "@/app/shared/shared-image/shared-image";
// import "swiper/css";
// import "swiper/css/pagination";
//
// interface slider {
//     data: { files: ContentFileInterface[] };
// }
//
// export default function CircularSlider({ data }: slider) {
//
//     return (
//         <div className="circular-slider">
//             <Swiper modules={[Pagination, Autoplay]} loop speed={500} slidesPerView={1} autoplay={{ delay: 3000, disableOnInteraction: false }}
//                     pagination={{clickable: true, renderBullet: (index, className) => `<span class="${className}"></span>`,}} style={{ width: "100%", height: "auto" }}
//             >
//                 {data.files.map((item, index) => (
//                     <SwiperSlide key={index}>
//                         <div className="circular-slider-items">
//                             <div className="circular-slider-items-image">
//                                 <SharedImage
//                                     className="border-radius-14px"
//                                     width={1920}
//                                     height={1080}
//                                     aspect={'16/9'}
//                                     imageSize="image_large"
//                                     src={item.file.thump_path}
//                                     fallbackSrc={item.file.file_path}
//                                     alt={item.title}/>
//                             </div>
//                             <div className="circular-slider-items-content py-3 px-5">
//                                 <h3 className="text-white fw-bold">{ item.title }</h3>
//                                 <p className="text-white fs-20px text-over o4">{ item.description }</p>
//                             </div>
//                         </div>
//                     </SwiperSlide>
//                 ))}
//             </Swiper>
//         </div>
//     );
// }
