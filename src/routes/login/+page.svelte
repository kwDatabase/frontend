<script>
    import { Button } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { isLoggedIn, userInfo } from '$src/stores/auth'; // 상태 관리 스토어
    let id = ''; // 아이디 입력 값
    let password = ''; // 비밀번호 입력 값
    let errorMessage = ''; // 에러 메시지
  
    // 로그인 요청 함수
    async function handleLogin() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('로그인 성공!');
          console.log('서버 응답:', data);
          isLoggedIn.set(true); // 로그인 상태를 true로 설정
          userInfo.set(data.user); // 사용자 정보를 스토어에 저장
          localStorage.setItem('token', data.token); // JWT 토큰을 LocalStorage에 저장
          window.location.href = '/'; // 성공 시 메인화면으로 이동
        } else {
          errorMessage = data.error || '로그인 실패';
        }
      } catch (err) {
        errorMessage = '서버와 통신 중 오류가 발생했습니다.';
        console.error(err);
      }
    }
  
    // 회원가입 페이지로 이동
    function goToSignUp() {
      window.location.href = '/join'; // 회원가입 페이지 URL
    }
  </script>
  
  <main>
    <p class="text-2xl font-bold mb-4">Login</p>
    <form on:submit|preventDefault={handleLogin}>
      <div>
        <label for="id" class="block text-sm font-medium">ID:</label>
        <input
          type="text"
          id="id"
          bind:value={id}
          placeholder="Enter your ID"
          required
          class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring focus:ring-opacity-40"
        />
      </div>
      <div class="mt-4">
        <label for="password" class="block text-sm font-medium">Password:</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring focus:ring-opacity-40"
        />
      </div>
      <div class="mt-4">
        <Button type="submit" class="bg-blue-500">Login</Button>
      </div>
    </form>
  
    {#if errorMessage}
      <p class="mt-4 text-red-500">{errorMessage}</p>
    {/if}
  
    <div class="mt-4">
      <p class="text-sm">계정이 없으신가요?</p>
      <Button on:click={goToSignUp} class="bg-gray-500 mt-2">Sign Up</Button>
    </div>
  </main>
  
  <style>
    main {
      max-width: 400px;
      margin: 50px auto;
      text-align: center;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  </style>
  