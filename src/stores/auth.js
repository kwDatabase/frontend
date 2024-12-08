import { writable } from 'svelte/store';

// LocalStorage에서 초기값 가져오기 (브라우저 환경에서만 실행)
const storedIsLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false;
const storedUserInfo = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) || null : null;

// 로그인 상태 관리
export const isLoggedIn = writable(storedIsLoggedIn);

// 사용자 정보 관리
export const userInfo = writable(storedUserInfo);

// 상태 변경 시 LocalStorage에 저장 (브라우저 환경에서만 실행)
if (typeof window !== 'undefined') {
  isLoggedIn.subscribe(value => {
    localStorage.setItem('isLoggedIn', value);
  });

  userInfo.subscribe(value => {
    localStorage.setItem('userInfo', JSON.stringify(value));
  });
}
