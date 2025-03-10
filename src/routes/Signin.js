// src/components/Signin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/signin.css';

function Signin() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 로그인 에러 메시지를 저장할 state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8080/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ loginId, password })
        });
        if(!response.ok) {
            throw new Error('login failed');
        }
        const data = await response.json();
    } catch (error) {
        console.error(error);
        navigate('/signin')
    }
    navigate('/'); // 원하는 경로로 이동
    // 또는, 로그인 성공 시 홈 페이지나 마이페이지 등 다른 페이지로 이동할 수 있습니다.
  };

  return (
    <div className="signin-page">  {/* 최상위 컨테이너 */}
      <div className="login-container">
        <h2>
          <a
            className="home-link"
            href="/"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            𝓦𝓮𝓫𝓽𝓸𝓸𝓷 𝓖𝓾𝓘𝓭𝓮
          </a>
        </h2>
        <form id="loginForm" onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="id"
              name="id"
              placeholder="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="pwd"
              name="pwd"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button type="submit" id="loginBtn">
              Login
            </button>
          </div>
        </form>
        <div className="divider">
          <span>or</span>
        </div>
        <div className="social-login">
          <button className="google" id="google-login-btn">
            Google
          </button>
          <button className="kakao" id="kakao-login-btn">
            Kakao
          </button>
          <button className="naver" id="naver-login-btn">
            Naver
          </button>
          <div className="clearfix"></div>
        </div>
        <div className="account-link">
          <a href="/signup" className="signup">
            계정이 없으신가요?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signin;
