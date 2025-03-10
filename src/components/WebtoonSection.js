// src/components/WebtoonSection.js
import React from 'react';
import '../css/home.css';

function WebtoonSection({ title, webtoons, onMoreClick }) {
  return (
    <div className="webtoon-section">
      <div className="section-header">
        <h2>{title}</h2>
        <div className="section-divider"></div>
        <button className="more-button" onClick={onMoreClick}>
          더보기
        </button>
      </div>
      <div className="webtoon-list">
        <div className="webtoon-list-inner">
          {webtoons.map((webtoon, index) => (
            <div key={index} className="webtoon-item" style={{ width: '120px', height: '160px' }}>
              <div
                className="webtoon-image-placeholder"
                style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
              >
                <div className="webtoon-title" style={{ color: 'white', padding: '5px' }}>
                  {webtoon.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WebtoonSection;
