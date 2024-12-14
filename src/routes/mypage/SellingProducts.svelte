<script>
  export let userId;
  let products = [];
  let totalPages = 1;
  let currentPage = 1;
  let errorMessage = '';
  let isLoading = true;

  async function fetchSellingProducts(page = 1) {
    isLoading = true;
    try {
      const response = await fetch('http://localhost:3000/mypage/selling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, page }),
      });

      if (!response.ok) {
        throw new Error('판매 중인 상품을 불러오는 데 실패했습니다.');
      }

      const data = await response.json();
      products = data.products;
      totalPages = data.totalPages;
      currentPage = data.currentPage;
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  }

  // 초기 데이터 로드
  fetchSellingProducts();

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      fetchSellingProducts(page);
    }
  }
</script>

<div>
  {#if isLoading}
    <p>Loading...</p>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else if products.length > 0}
    <ul class="space-y-1">
      {#each products as product}
        <li>
          <a href={`/products/${product.Id}`} class="text-blue-600 hover:underline">
            {product.title}
          </a>
        </li>
      {/each}
    </ul>

    <!-- 페이지네이션 -->
    <div class="flex justify-center mt-4 space-x-2">
      {#if currentPage > 1}
        <button class="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded" on:click={() => goToPage(currentPage - 1)}>
          이전
        </button>
      {/if}
      {#each Array(totalPages).fill() as _, index}
        <button
          class="px-3 py-1 rounded"
          class:font-bold={currentPage === index + 1}
          on:click={() => goToPage(index + 1)}
        >
          {index + 1}
        </button>
      {/each}
      {#if currentPage < totalPages}
        <button class="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded" on:click={() => goToPage(currentPage + 1)}>
          다음
        </button>
      {/if}
    </div>
  {:else}
    <p>판매 중인 물품이 없습니다.</p>
  {/if}
</div>

<style>
  .font-bold {
    font-weight: bold;
    color: white;
    background-color: blue;
  }
</style>
