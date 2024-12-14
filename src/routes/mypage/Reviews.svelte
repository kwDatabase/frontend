<script>
  export let sellerId;
  let reviews = [];
  let totalPages = 1;
  let currentPage = 1;
  let errorMessage = '';
  let isLoading = true;
  let averageRating = 0; // 평균 평점을 저장할 변수

  // 구매자 평가 가져오기
  async function fetchBuyerReviews(page = 1) {
    isLoading = true; // 로딩 상태 표시
    try {
      const response = await fetch('http://localhost:3000/mypage/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId, page }), // 페이지 번호 추가
      });

      if (!response.ok) {
        throw new Error('리뷰 데이터를 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      reviews = data.reviews;
      totalPages = data.totalPages;
      currentPage = data.currentPage;

      // 평균 평점 계산
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = (totalRating / reviews.length).toFixed(1); // 소수점 1자리까지 표시
      } else {
        averageRating = 0; // 리뷰가 없으면 0으로 설정
      }
    } catch (error) {
      errorMessage = error.message;
      console.error(error);
    } finally {
      isLoading = false;
    }
  }

  // 초기 데이터 로드
  fetchBuyerReviews();

  // 페이지 이동
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      fetchBuyerReviews(page);
    }
  }
</script>

<div>
  <h2 class="text-xl font-semibold mt-4 flex items-center justify-between">
    <span class="text-gray-600 text-sm">현재 내 평점: {averageRating} / 5</span>
  </h2>

  {#if isLoading}
    <p>Loading...</p>
  {:else if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {:else if reviews.length > 0}
    <!-- 테이블 스타일로 가로 정렬 -->
    <table class="table-auto w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2 text-left">구매자</th>
          <th class="border border-gray-300 px-4 py-2 text-left">내용</th>
          <th class="border border-gray-300 px-4 py-2 text-left">평점</th>
          <th class="border border-gray-300 px-4 py-2 text-left">링크</th>
        </tr>
      </thead>
      <tbody>
        {#each reviews as review}
          <tr class="hover:bg-gray-100">
            <td class="border border-gray-300 px-4 py-2">{review.user_id}</td>
            <td class="border border-gray-300 px-4 py-2">{review.content}</td>
            <td class="border border-gray-300 px-4 py-2">{review.rating} / 5</td>
            <td class="border border-gray-300 px-4 py-2">
              <a
                href={`/products/${review.product_id}`}
                class="text-blue-600 hover:underline"
              >
                해당 상품 보기
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="flex justify-center mt-4 space-x-2">
      {#if currentPage > 1}
        <button
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
          on:click={() => goToPage(currentPage - 1)}
        >
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
        <button
          class="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded"
          on:click={() => goToPage(currentPage + 1)}
        >
          다음
        </button>
      {/if}
    </div>
  {:else}
    <p>구매자 평가가 없습니다.</p>
  {/if}
</div>

<style>
  .font-bold {
    font-weight: bold;
    color: white;
    background-color: blue;
  }
</style>
