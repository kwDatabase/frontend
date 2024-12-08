<script>
  let name = '';
  let id = '';
  let password = ''; 
  let confirmPassword = ''; // 비밀번호 확인
  let nickname = '';
  let errorMessage = ''; 
  let successMessage = ''; 

  // 회원가입 요청 함수
  async function handleSignUp() {
    // 비밀번호 확인
    if (password !== confirmPassword) {
      errorMessage = '비밀번호가 일치하지 않습니다.';
      successMessage = '';
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id, password , nickname}),
      });

      const data = await response.json();

      if (response.ok) {
        successMessage = '회원가입이 완료되었습니다!';
        errorMessage = '';
        window.location.href = '/login';
      } else {
        successMessage = '';
        errorMessage = data.error || '회원가입에 실패했습니다.';
      }
    } catch (err) {
      errorMessage = '서버와 통신 중 오류가 발생했습니다.';
      successMessage = '';
      console.error(err);
    }
  }
</script>

<main class="max-w-md mx-auto mt-10">
  <h1 class="text-2xl font-bold text-center mb-6">회원가입</h1>

  <form on:submit|preventDefault={handleSignUp} class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">이름:</label>
      <input
        type="text"
        id="name"
        bind:value={name}
        required
        placeholder="이름을 입력하세요"
        class="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
    <div>
      <label for="id" class="block text-sm font-medium text-gray-700">ID:</label>
      <input
        type="text"
        id="id"
        bind:value={id}
        required
        placeholder="ID를 입력하세요"
        class="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        placeholder="비밀번호를 입력하세요"
        class="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required
        placeholder="비밀번호를 한 번 더 입력하세요"
        class="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
    <div>
      <label for="nickname" class="block text-sm font-medium text-gray-700">별명:</label>
      <input
        type="text"
        id="nickname"
        bind:value={nickname}
        required
        placeholder="미입력 시 ID가 별명으로 설정됩니다."
        class="block w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
    <div>
      <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
        Sign Up
      </button>
    </div>
  </form>

  {#if errorMessage}
    <p class="mt-4 text-sm text-red-500">{errorMessage}</p>
  {/if}

  {#if successMessage}
    <p class="mt-4 text-sm text-green-500">{successMessage}</p>
  {/if}
</main>

<style>
  main {
    font-family: Arial, sans-serif;
  }
</style>
