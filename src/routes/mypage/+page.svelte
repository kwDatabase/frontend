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

<main class="max-w-4xl mx-auto mt-6 p-4 bg-gray-50 shadow rounded">
  {#if user}
    <h1 class="text-2xl font-bold mb-4">{user.name}'s MyPage</h1>

    <section class="mb-6 border-b pb-4">
      <h2 class="text-xl font-semibold mb-2">현재 판매 중인 물품</h2>
      <SellingProducts userId={user.id} />
    </section>

    <section class="mb-6 border-b pb-4">
      <h2 class="text-xl font-semibold mb-2">판매 완료된 물품</h2>
      <SoldProducts userId={user.id} />
    </section>

    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">구매자 평가</h2>
      <Reviews sellerId={user.id} />
    </section>
  {:else}
    <p>로그인 정보를 불러오는 중입니다...</p>
  {/if}
</main>

<style>
  main {
    font-family: Arial, sans-serif;
  }
</style>
