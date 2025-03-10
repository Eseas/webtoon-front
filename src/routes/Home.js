import React from 'react';
import MySwiperCarousel from '../components/MySwiperCarousel';
import WebtoonSection from '../components/WebtoonSection';
import Navbar from '../components/Navbar';
import knightrun1 from '../images/knightrun_1.jpeg';
import knightrun2 from '../images/knightrun_2.jpeg';

function Home() {
    const carouselImages = [
        { src: knightrun1, alt: 'Slide 1' },
        { src: knightrun2, alt: 'Slide 2' }
    ];
    
    const newWebtoons = [
        { title: '신작 웹툰 테스트 제목 1' },
        { title: '신작 웹툰 테스트 제목 2' },
        { title: '신작 웹툰 테스트 제목 3' },
        { title: '신작 웹툰 테스트 제목 4' },
        { title: '신작 웹툰 테스트 제목 5' },
        { title: '신작 웹툰 테스트 제목 6' },
    ];
    
    const popularWebtoons = [
        { title: '인기 웹툰 테스트 제목 1' }
    ];

    return (
        <div className="App">
          <Navbar />
          <div>
            <MySwiperCarousel images={carouselImages} />
          </div>
          <WebtoonSection
            title="신작 웹툰"
            webtoons={newWebtoons}
            onMoreClick={() => console.log('신작 웹툰 더보기')}
          />
          <WebtoonSection
            title="인기 웹툰"
            webtoons={popularWebtoons}
            onMoreClick={() => console.log('인기 웹툰 더보기')}
          />
        </div>
      );
}

export default Home;
