// src/components/Navbar.js
import React from 'react';
import '../css/navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="/" className="nav-button">웹툰가이드</a>
      </div>
      <div className="navbar-right">
        <a href="#" className="nav-button" id="search-button">
          {/* SVG 아이콘 포함 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zm-5.442 1.31a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
          </svg>
          검색
        </a>
        <span className="separator"></span>
        <a href="/signin" className="nav-button">로그인</a>
        <span className="separator"></span>
        <a href="/mypage" className="nav-button">마이페이지</a>
        <span className="separator"></span>
        <a href="/webtoon-list" className="nav-button">웹툰 리스트</a>
        <span className="separator"></span>
        <a href="/webtoon-recommend" className="nav-button">웹툰 추천</a>
      </div>
    </div>
  );
}

export default Navbar;
