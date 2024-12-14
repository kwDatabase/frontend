<script>
  import { userInfo } from '$src/stores/auth';
  import SellingProducts from './SellingProducts.svelte';
  import SoldProducts from './SoldProducts.svelte';
  import Reviews from './Reviews.svelte';

  let user;

  // 사용자 정보 구독
  userInfo.subscribe(value => {
    user = value;
  });
</script>

<main class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
  <div class="max-w-6xl mx-auto px-4 py-8">
    {#if user}
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
        <div class="flex items-center space-x-4 mb-8">
          <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-3xl text-white font-bold">{user.name[0]}</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-800 dark:text-white">{user.name}님의 마이페이지</h1>
            <p class="text-gray-600 dark:text-gray-300 mt-1">환영합니다!</p>
          </div>
        </div>

        <div class="grid gap-8">
          <section class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-transform hover:scale-[1.02]">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <span class="material-icons mr-2">store</span>
              현재 판매 중인 물품
            </h2>
            <SellingProducts userId={user.id} />
          </section>

          <section class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-transform hover:scale-[1.02]">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <span class="material-icons mr-2">inventory</span>
              판매 완료된 물품
            </h2>
            <SoldProducts userId={user.id} />
          </section>

          <section class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-transform hover:scale-[1.02]">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <span class="material-icons mr-2">star</span>
              구매자 평가
            </h2>
            <Reviews sellerId={user.id} />
          </section>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-center h-screen">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-300">로그인 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  main {
    font-family: 'Noto Sans KR', sans-serif;
  }

  section {
    transition: all 0.3s ease;
  }

  section:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
</style>
