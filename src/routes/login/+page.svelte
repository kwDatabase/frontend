<script>
    import { Button } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { isLoggedIn, userInfo } from '$src/stores/auth';
    let id = '';
    let password = '';
    let errorMessage = '';
  
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
          isLoggedIn.set(true);
          userInfo.set(data.user);
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        } else {
          errorMessage = data.error || '로그인 실패';
        }
      } catch (err) {
        errorMessage = '서버와 통신 중 오류가 발생했습니다.';
        console.error(err);
      }
    }
  
    function goToSignUp() {
      window.location.href = '/join';
    }
</script>

<div class="flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        로그인
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        환영합니다! 계정 정보를 입력해주세요.
      </p>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="id" class="sr-only">아이디</label>
          <input
            id="id"
            type="text"
            bind:value={id}
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div>
          <label for="password" class="sr-only">비밀번호</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 focus:z-10 sm:text-sm"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
      </div>

      {#if errorMessage}
        <div class="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
          <div class="flex">
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800 dark:text-red-200">{errorMessage}</p>
            </div>
          </div>
        </div>
      {/if}

      <div>
        <Button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          로그인
        </Button>
      </div>
    </form>

    <div class="text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        아직 계정이 없으신가요?
      </p>
      <Button
        on:click={goToSignUp}
        class="mt-2 w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        회원가입
      </Button>
    </div>
  </div>
</div>

<style>
  :global(body) {
    @apply bg-gray-50 dark:bg-gray-900;
  }
</style>