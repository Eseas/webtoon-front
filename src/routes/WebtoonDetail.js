import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../css/webtoonDetail.css';

const WebtoonComponent = () => {
  const [data, setData] = useState(null);
  const [platform, setPlatform] = useState(null);

  const roleMapping = {
    PICTURE: "그림",
    WRITING: "글",
    ORIGIN: "원작"
  };

  const serialStatusMapping = {
    "SERIAL" : "연재",
    "FIN" : "완결"
  };

  // SerialCycle enum의 한글 매핑
  const serialCycleMapping = {
    "MON" : "월",
    "TUE" : "화",
    "WED" : "수",
    "THU" : "목",
    "FRI" : "금",
    "SAT" : "토",
    "SUN" : "일",
    "DAY" : "매일",
    "TEN" : "텐",
    "FIN" : "완결"
  };

  // 페이지가 로드될 때 URL 파라미터 읽고 데이터를 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const plat = urlParams.get('platform');
    setPlatform(plat);

    // 유효한 플랫폼 값인지 확인
    if (plat !== 'naver' && plat !== 'kakao') {
      console.error('Invalid platform value. Use either "naver" or "kakao".');
      return;
    }

    // fetch API를 이용한 데이터 요청
    fetch(`http://localhost:8080/api/webtoons/detail?id=${id}&platform=${plat}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Response:', responseData);
        setData(responseData);
      })
      .catch(err => console.error('Error:', err));
  }, []);

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

  // 업로드 주기 텍스트 변환 함수  
  // 데이터의 uploadCycle 값이 문자열이면 serialCycleMapping을 이용하고, 정수면 기존 로직을 사용
  const getUploadCycleText = (uploadCycle) => {
    if (typeof uploadCycle === 'string') {
      return serialCycleMapping[uploadCycle] || '알 수 없음';
    }
    
    // 숫자로 들어온 경우, 예: 123 -> "월요일, 화요일, 수요일"
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
  };

  // 아직 데이터가 없으면 로딩 메시지 표시
  if (!data) {
    return <div>Loading...</div>;
  }

  // 플랫폼에 따른 웹툰 링크 설정
  let webtoonLink = '#';
  if (platform === 'naver') {
    webtoonLink = `https://comic.naver.com/webtoon/list?titleId=${data.contentId}`;
  } else if (platform === 'kakao') {
    webtoonLink = `https://page.kakao.com/content/${data.contentId}`;
  }

  return (
    <>
      <Navbar />
      <div id="webtoon-container">
        <img
          src={`/image/kakao_main_image/${data.contentId}/${data.contentId}.jpg`}
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
          <p>상태: {getSerialStatus(data.serialStatus) || '알 수 없음'}</p>
          {data.status !== '완결' && (
            <p>업로드 주기: {getUploadCycleText(data.uploadCycle)}</p>
          )}
          <p>연령 제한: {getAgeLimitText(data.ageLimit)}</p>
          <div className="divider"></div>
          <div dangerouslySetInnerHTML={{ __html: data.description || '설명 없음' }} />
          {/*<p className="hashtags">해시태그: {data.hashtags || '없음'}</p>*/}
        </div>
      </div>
    </>
  );
};

export default WebtoonComponent;
