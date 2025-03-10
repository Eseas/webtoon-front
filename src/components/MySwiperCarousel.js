import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import '../css/mySwiperStyles.css';

function MySwiperCarousel({ images }) {
  return (
    <Swiper
        spaceBetween={30}
        effect={'fade'}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
      >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image.src}
            alt={image.alt || `Slide ${index}`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default MySwiperCarousel;
