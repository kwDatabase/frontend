<script>
    export let sellerId;
    let reviews = [];
    let errorMessage = '';
    let isLoading = true;
  
    // 구매자 평가 가져오기
    async function fetchBuyerReviews() {
      try {
        const response = await fetch('http://localhost:3000/mypage/reviews', {
          method: 'POST', // POST 요청으로 변경
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sellerId }), // 본문에 sellerId 포함
        });
  
        if (!response.ok) {
          throw new Error('리뷰 데이터를 가져오는 데 실패했습니다.');
        }
  
        reviews = await response.json();
      } catch (error) {
        errorMessage = error.message;
        console.error(error);
      } finally {
        isLoading = false;
      }
    }
  
    fetchBuyerReviews();
  </script>
  
  <div>
    {#if isLoading}
      <p>Loading...</p>
    {:else if errorMessage}
      <p class="text-red-500">{errorMessage}</p>
    {:else if reviews.length > 0}
      <ul>
        {#each reviews as review}
          <li>
            <p>구매자: {review.reviewer}</p>
            <p>평점: {review.rating} / 10</p>
            <p>내용: {review.content}</p>
          </li>
        {/each}
      </ul>
    {:else}
      <p>구매자 평가가 없습니다.</p>
    {/if}
  </div>
  