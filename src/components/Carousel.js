// src/components/Carousel.js
import React, { useState } from 'react';
import '../css/carousel.css'

function Carousel({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = (e) => {
    e.preventDefault();
    setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const goToNext = (e) => {
    e.preventDefault();
    setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  const selectIndex = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            style={{ display: index === activeIndex ? 'block' : 'none' }}
          >
            <img src={image.src} alt={image.alt || `Slide ${index}`} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
      <a className="carousel-control-prev" href="#" onClick={goToPrev} role="button">
        &lt;
      </a>
      <a className="carousel-control-next" href="#" onClick={goToNext} role="button">
        &gt;
      </a>
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === activeIndex ? 'active' : ''}`}
            onClick={() => selectIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
