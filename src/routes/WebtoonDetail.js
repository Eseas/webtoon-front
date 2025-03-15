import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../css/webtoonDetail.css';
import CardItem from '../components/CardItem';

const WebtoonComponent = () => {
  const location = useLocation(); // 현재 URL 정보
  const [data, setData] = useState(null);
  const [recommendedWebtoons, setRecommendedWebtoons] = useState([]); // 추천 웹툰 목록

  const roleMapping = {
    PICTURE: "그림",
    WRITING: "글",
    ORIGIN: "원작"
  };

  const serialStatusMapping = {
    "SERIAL": "연재",
    "COMPLETE": "완결"
  };

  // SerialCycle enum의 한글 매핑
  const serialCycleMapping = {
    "MON": "월",
    "TUE": "화",
    "WED": "수",
    "THU": "목",
    "FRI": "금",
    "SAT": "토",
    "SUN": "일",
    "DAY": "매일",
    "TEN": "10일",
    "FIN": "완결"
  };

  // URL 쿼리 스트링이 변경될 때마다 fetch하도록 의존성 배열에 location.search 추가
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get('id');

    // 웹툰 상세 정보 fetch
    fetch(`http://localhost:8080/api/webtoons/detail?id=${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Detail Response:', responseData);
        setData(responseData);
      })
      .catch(err => console.error('Error:', err));

    // 추천 웹툰 목록 fetch
    fetch(`http://localhost:8080/api/webtoons/recommend?id=${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(recommendData => {
        console.log('Recommend Response:', recommendData);
        setRecommendedWebtoons(recommendData);
      })
      .catch(err => console.error('Error:', err));
  }, [location.search]); // URL 쿼리 스트링 변경 시 재실행

  // 연령 제한 텍스트 변환 함수
  const getAgeLimitText = (ageLimit) => {
    if (ageLimit === 0) {
      return '전체 이용가';
    } else if (ageLimit === 15) {
      return '15세 이용가';
    } else if (ageLimit === 18) {
      return '19세 이용가';
    } else {
      return '알 수 없음';
    }
  };

  const getUploadCycleText = (uploadCycle) => {
    // uploadCycle이 배열인 경우 처리
    if (Array.isArray(uploadCycle)) {
      return uploadCycle
        .map(cycle => serialCycleMapping[cycle] || '알 수 없음')
        .join(', ');
    }
    
    // uploadCycle이 문자열인 경우 처리
    if (typeof uploadCycle === 'string') {
      return serialCycleMapping[uploadCycle] || '알 수 없음';
    }
    
    // 숫자로 들어온 경우 (예: 123 -> "월요일, 화요일, 수요일")
    const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
    if (Number.isInteger(uploadCycle)) {
      return uploadCycle
        .toString()
        .split('')
        .map(num => days[parseInt(num, 10) - 1])
        .join(', ');
    }
    
    return '알 수 없음';
  };

  const getSerialStatus = (serialStatus) => {
    if (typeof serialStatus === 'string') {
      return serialStatusMapping[serialStatus] || '알 수 없음';
    }
    return '알 수 없음';
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  let webtoonLink = '#';
  if (data.serialSource === 'naver') {
    webtoonLink = `https://comic.naver.com/webtoon/list?titleId=${data.contentId}`;
  } else if (data.serialSource === 'kakao') {
    webtoonLink = `https://page.kakao.com/content/${data.contentId}`;
  }

  return (
    <>
      <Navbar />
      <div className="outer-container">
        {/* 메인 웹툰 컨테이너 */}
        <div id="webtoon-container">
          <div className="webtoon-main">
            <img
              src={
                data.serialSource === "KAKAOPAGE"
                  ? `/image/kakao_main_image/${data.contentId}/${data.contentId}.jpg`
                  : `/image/naver_main_image/${data.contentId}/${data.contentId}.jpg`
              }
              alt={data.title || '웹툰 메인 이미지'}
            />
            <div className="divider"></div>
            <div className="webtoon-info">
              <a href={webtoonLink} target="_blank" rel="noopener noreferrer">
                <button>해당 웹툰 보러 가기</button>
              </a>
              <h2>{data.title || '제목 없음'}</h2>
              {Object.entries(data.authorList).map(([name, role]) => (
                <div key={name}>
                  <strong>{name}</strong> {'<'}{roleMapping[role]}{'>'}
                </div>
              ))}
              <p>총 에피소드: {data.totalEpisodes || '알 수 없음'}</p>
              <p>상태: {getSerialStatus(data.serialStatus)}</p>
              {data.serialStatus !== 'COMPLETE' && (
                <p>업로드 주기: {getUploadCycleText(data.uploadCycle)}</p>
              )}
              <p>연령 제한: {getAgeLimitText(data.ageLimit)}</p>
              <div className="divider"></div>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.description || '설명 없음'
                }}
              />
            </div>
          </div>
        </div>
  
        {/* 추천 웹툰 컨테이너 */}
        <div className="recommendations-container">
          <h3>추천 웹툰</h3>
          <ul className="cards__items">
            {recommendedWebtoons.map(item => {
              const detailPath = `/webtoons/detail?id=${item.id}`;
              return (
                <CardItem
                  key={item.id}
                  src={
                    item.serialSource === "KAKAOPAGE"
                      ? `/image/kakao_main_image/${item.contentId}/${item.contentId}.jpg`
                      : `/image/naver_main_image/${item.contentId}/${item.contentId}.jpg`
                  }
                  text={item.title}
                  label={item.label}
                  path={detailPath}
                />
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default WebtoonComponent;
