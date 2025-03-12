import React, { useState, useEffect, useRef } from 'react';
import CardItem from '../components/CardItem';
import Navbar from '../components/Navbar';
import '../css/webtoonList.css';

const WebtoonGuide = () => {
  const [webtoons, setWebtoons] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLast, setIsLast] = useState(false); // ✅ 마지막 페이지 여부 추가
  const observerTarget = useRef(null);

  // 📌 초기 웹툰 데이터 로딩
  const loadInitialWebtoons = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/webtoons?page=0`);
      if (response.ok) {
        const data = await response.json();
        setWebtoons(data.content || []);
        setPage(1); // ✅ 다음 페이지부터 불러오도록 설정
        setIsLast(data.isLast); // ✅ 마지막 페이지 여부 업데이트
      } else {
        console.error('웹툰 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('웹툰 데이터를 불러오는 중 오류가 발생했습니다.', error);
    }
    setIsLoading(false);
  };

  // 📌 추가 웹툰 데이터 로딩 (무한 스크롤)
  const loadMoreWebtoons = async () => {
    if (isLoading || isLast) return; // ✅ 마지막 페이지면 요청 안 함
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/webtoons?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        setWebtoons(prev => [...prev, ...(data.content || [])]); // ✅ 기존 데이터 유지
        setPage(prev => prev + 1); // ✅ 페이지 증가
        setIsLast(data.isLast); // ✅ 마지막 페이지 여부 업데이트
      } else {
        console.error('추가 웹툰 데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('추가 웹툰 데이터를 불러오는 중 오류가 발생했습니다.', error);
    }
    setIsLoading(false);
  };

  // 📌 컴포넌트 마운트 시 초기 데이터 로딩
  useEffect(() => {
    loadInitialWebtoons();
  }, []);

  // 📌 Intersection Observer를 이용한 무한 스크롤
  useEffect(() => {
    if (isLast) return; // ✅ 마지막 페이지라면 Observer 등록 안 함

    const target = observerTarget.current; // ✅ ref를 변수에 저장
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading && !isLast) {
          loadMoreWebtoons();
        }
      });
    });

    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target); // ✅ cleanup 시 observer 해제
    };
  }, [isLoading, page, loadMoreWebtoons, isLast]); // ✅ `isLast` 의존성 추가

  return (
    <>
      <Navbar />
      <h1>현재 테스트를 위해 카카오 페이지 웹툰만 보여지고 있습니다.</h1>

      {/* 웹툰 리스트 */}
      <ul className="webtoon-list">
        {webtoons.map((webtoon, index) => (
          <React.Fragment key={webtoon.id}>
            <CardItem
              src={`/image/kakao_main_image/${webtoon.contentId}/${webtoon.contentId}.jpg`} // ✅ 기존 이미지 유지
              text={webtoon.title} // ✅ 웹툰 제목 전달
              path={`/webtoons/detail?id=${webtoon.id}&platform=kakao`} // ✅ 상세 페이지 링크
              label="웹툰" // ✅ 카테고리 라벨
            />
            {/* ✅ observer-target을 웹툰 리스트의 마지막에서 세 번째 줄로 배치 */}
            {index === webtoons.length - 3 && !isLast && (
              <div id="observer-target" className="observer-target" ref={observerTarget}></div>
            )}
          </React.Fragment>
        ))}
      </ul>

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div id="loading-indicator" className="spinner">
          로딩중...
        </div>
      )}
    </>
  );
};

export default WebtoonGuide;
