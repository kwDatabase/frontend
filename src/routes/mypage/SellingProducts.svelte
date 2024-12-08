<script>
  export let userId;
  let products = [];
  let errorMessage = '';
  let isLoading = true;

  // 현재 판매 중인 상품 가져오기
  async function fetchSellingProducts() {
    try {
      const response = await fetch('http://localhost:3000/mypage/selling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('판매 중인 상품을 불러오는 데 실패했습니다.');
      }

      products = await response.json();
    } catch (error) {
      errorMessage = error.message;
      console.error(error);
    } finally {
      isLoading = false;
    }
  }

  fetchSellingProducts();
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
          <a href={`/product/${product.Id}`} class="text-blue-600 hover:underline">
            {product.title}
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p>판매 중인 물품이 없습니다.</p>
  {/if}
</div>
