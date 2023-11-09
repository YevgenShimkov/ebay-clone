'use client'

import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const CarouselComp = () => {
  return (
    <div className='max-w-[1200px] mx-auto'>
      <Carousel showArrows={true} autoPlay={true} interval={3000} infiniteLoop={true} showThumbs={false}>
        <img src="/images/banners/1.png" alt="baner img"/>
        <img src="/images/banners/2.png" alt="baner img"/>
        <img src="/images/banners/3.png" alt="baner img"/>
      </Carousel>
    </div>
  )
}

export default CarouselComp;

