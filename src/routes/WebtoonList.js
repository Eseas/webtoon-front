import React, { useState, useEffect, useRef, useCallback } from 'react';
import CardItem from '../components/CardItem';
import Navbar from '../components/Navbar';
import '../css/webtoonList.css';

const WebtoonGuide = () => {
  // 웹툰 리스트
  const [webtoons, setWebtoons] = useState([]);
  // 현재 페이지
  const [page, setPage] = useState(0);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 마지막 페이지 여부
  const [isLast, setIsLast] = useState(false);

  // 필터 상태 (요일, 플랫폼)
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedPublisher, setSelectedPublisher] = useState('all');

  // Intersection Observer 타겟
  const observerTarget = useRef(null);

  // ---------------------
  // 데이터 로딩 함수
  // ---------------------

  // 초기 웹툰 데이터 불러오기
  const loadInitialWebtoons = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", 0);
      queryParams.set("offset", 60);
      if (selectedDay !== "all") {
        queryParams.set("day", selectedDay);
      }
      if (selectedPublisher !== "all") {
        queryParams.set("publisher", selectedPublisher);
      }
      const response = await fetch(`http://localhost:8080/api/webtoons?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setWebtoons(data.content || []);
        setPage(1);          // 다음 페이지부터 로딩
        setIsLast(data.isLast);
      } else {
        console.error('웹툰 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('웹툰 데이터를 불러오는 중 오류가 발생했습니다.', error);
    }
    setIsLoading(false);
  }, [selectedDay, selectedPublisher]);

  // 추가 웹툰 데이터 불러오기 (무한 스크롤)
  const loadMoreWebtoons = async () => {
    if (isLoading || isLast) return;

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page);
      queryParams.set("offset", 24);
      if (selectedDay !== "all") {
        queryParams.set("day", selectedDay);
      }
      if (selectedPublisher !== "all") {
        queryParams.set("publisher", selectedPublisher);
      }
      const response = await fetch(`http://localhost:8080/api/webtoons?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setWebtoons((prev) => [...prev, ...(data.content || [])]);
        setPage((prev) => prev + 1);
        setIsLast(data.isLast);
      } else {
        console.error('추가 웹툰 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('추가 웹툰 데이터를 불러오는 중 오류가 발생했습니다.', error);
    }
    setIsLoading(false);
  };

  // ---------------------
  // useEffect 훅
  // ---------------------

  // 필터가 변경될 때마다(또는 컴포넌트 최초 마운트 시) 초기 웹툰 로딩
  useEffect(() => {
    loadInitialWebtoons();
  }, [loadInitialWebtoons]);

  // Intersection Observer 설정
  useEffect(() => {
    if (isLast) return;

    const target = observerTarget.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading && !isLast) {
          loadMoreWebtoons();
        }
      });
    });

    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [isLoading, page, selectedDay, selectedPublisher, isLast]);

  // ---------------------
  // 필터 버튼 핸들러
  // ---------------------

  // 요일 필터
  const handleDayFilter = (day) => {
    setSelectedDay(day);
    setPage(0);
    setIsLast(false);
  };

  // 출판사(플랫폼) 필터
  const handlePublisherFilter = (publisher) => {
    setSelectedPublisher(publisher);
    setPage(0);
    setIsLast(false);
  };

  return (
    <>
      <Navbar />

      {/* 필터 영역 */}
      <div className="filter-container">
        {/* 요일 필터 그룹 */}
        <div className="day-filter-group">
          <button
            className={`day-filter-button ${selectedDay === 'all' ? 'active' : ''}`}
            onClick={() => handleDayFilter('all')}
          >
            전체
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'MON' ? 'active' : ''}`}
            onClick={() => handleDayFilter('MON')}
          >
            월
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'TUE' ? 'active' : ''}`}
            onClick={() => handleDayFilter('TUE')}
          >
            화
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'WED' ? 'active' : ''}`}
            onClick={() => handleDayFilter('WED')}
          >
            수
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'THU' ? 'active' : ''}`}
            onClick={() => handleDayFilter('THU')}
          >
            목
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'FRI' ? 'active' : ''}`}
            onClick={() => handleDayFilter('FRI')}
          >
            금
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'SAT' ? 'active' : ''}`}
            onClick={() => handleDayFilter('SAT')}
          >
            토
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'SUN' ? 'active' : ''}`}
            onClick={() => handleDayFilter('SUN')}
          >
            일
          </button>
          <button
            className={`day-filter-button ${selectedDay === 'FIN' ? 'active' : ''}`}
            onClick={() => handleDayFilter('FIN')}
          >
            완결
          </button>
        </div>

        {/* 출판사(플랫폼) 필터 그룹 - 이미지 사용 */}
        <div className="publisher-filter-group">
          <button
            className={`publisher-filter-button ${selectedPublisher === 'all' ? 'active' : ''}`}
            onClick={() => handlePublisherFilter('all')}
          >
            전체
          </button>
          <button
            className={`publisher-filter-button ${selectedPublisher === 'KAKAOPAGE' ? 'active' : ''}`}
            onClick={() => handlePublisherFilter('KAKAOPAGE')}
          >
            <img src="/image/logo/kakaopage.png" alt="카카오페이지" />
          </button>
          <button
            className={`publisher-filter-button ${selectedPublisher === 'NAVER' ? 'active' : ''}`}
            onClick={() => handlePublisherFilter('NAVER')}
          >
            <img src="/image/logo/naver.png" alt="네이버웹툰" />
          </button>
        </div>
      </div>

      {/* 웹툰 리스트 */}
      <ul className="webtoon-list">
        {webtoons.map((webtoon, index) => (
          <React.Fragment key={webtoon.id}>
            <CardItem
              src={
                webtoon.serialSource === "KAKAOPAGE"
                  ? `/image/kakao_main_image/${webtoon.contentId}/${webtoon.contentId}.jpg`
                  : `/image/naver_main_image/${webtoon.contentId}/${webtoon.contentId}.jpg`
              }
              text={webtoon.title}
              path={
                webtoon.serialSource === "KAKAOPAGE"
                  ? `/webtoons/detail?id=${webtoon.id}`
                  : `/webtoons/detail?id=${webtoon.id}`
              }
              label="웹툰"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/image/basic_main/basic.jpg';
              }}
            />
            {/* 스크롤 지점 (리스트 마지막 아이템에 배치) */}
            {index === webtoons.length - 1 && !isLast && (
              <div
                id="observer-target"
                className="observer-target"
                ref={observerTarget}
              ></div>
            )}
          </React.Fragment>
        ))}
      </ul>

      {/* 로딩 스피너 */}
      {isLoading && (
        <div id="loading-indicator" className="spinner">
          로딩중...
        </div>
      )}
    </>
  );
};

export default WebtoonGuide;
