<script>
  import { Input, Button, Select, Textarea } from "flowbite-svelte";
  import { goto } from "$app/navigation"; // goto를 import 합니다.

  export let data; // 상품 정보 받기
  console.log("data : ", data);

  let updatedProduct = { ...data.product }; // 수정할 상품 정보 초기화

  let editingReviewIndex = null; // 현재 수정 중인 후기 인덱스
  let editingReviewId = null; // 현재 수정 중인 후기 ID
  let editingReviewContent = ""; // 수정할 후기 내용
  let editingRating = 0; // 수정 중인 후기에서 선택된 별점
  let originalReviewContent = ""; // 원래 후기 내용 저장

  let newReview = ""; // 신규 후기 입력값
  let newRating = 0; // 신규 후기에서 선택된 별점
  let newInquiry = ""; // 신규 문의 입력값
  let selectedRating = 0; // 선택된 별점
  let activeTab = "reviews"; // 현재 활성화된 탭 (reviews, inquiries)

  // 대댓글 입력값
  let newReply = ""; // 대댓글 입력값
  let currentInquiryIndex = null; // 현재 대댓글을 작성할 문의 인덱스

  // 날짜 변환 함수
  function parseDate(dateString) {
    const [datePart, timePart] = dateString.split(" "); // 날짜와 시간 분리
    const year = datePart.substring(0, 4);
    const month = datePart.substring(4, 6);
    const day = datePart.substring(6, 8);
    const hours = timePart.substring(0, 2);
    const minutes = timePart.substring(2, 4);

    // ISO 형식으로 변환
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
  }

  // 후기 추가 API
  async function addReview() {
    if (newReview.trim() !== "" && newRating > 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/reviews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: "Anonymous",
              content: newReview,
              rating: newRating,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("후기 추가에 실패했습니다.");
        }

        const reviewData = await response.json();
        updatedProduct.reviews.push({
          id: reviewData.id,
          userId: "Anonymous",
          content: newReview,
          date: new Date().toISOString(),
          rating: newRating,
        });
        newReview = ""; // 입력 필드 초기화
        newRating = 0; // 별점 초기화
        console.log("Current Reviews: ", updatedProduct.reviews);

        // 페이지 새로고침
        window.location.reload();
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("후기와 별점을 입력하세요.");
    }
  }
  // 문의 추가 API
  async function addInquiry() {
    if (newInquiry.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              asker: "Anonymous",
              content: newInquiry,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("문의 추가에 실패했습니다.");
        }

        const inquiryData = await response.json();
        updatedProduct.inquiries.push({
          id: inquiryData.id, // 서버에서 반환된 ID 사용
          asker: "Anonymous",
          content: newInquiry,
          date: new Date(),
          replies: [],
        });
        newInquiry = ""; // 입력 필드 초기화
        console.log("Current Inquiries: ", updatedProduct.inquiries);
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("문의 내용을 입력하세요.");
    }
  }

  // 후기 수정 API
  async function updateReview(reviewId) {
    const review = updatedProduct.reviews.find((r) => r.id === reviewId);
    if (!review) {
      alert("해당 리뷰를 찾을 수 없습니다.");
      return;
    }

    if (editingReviewContent.trim() !== "" && editingRating > 0) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/reviews/${reviewId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: editingReviewContent,
              rating: editingRating, // 수정할 별점
            }),
          },
        );

        if (!response.ok) {
          throw new Error("후기 수정에 실패했습니다.");
        }

        // 리뷰 수정
        review.content = editingReviewContent;
        review.rating = editingRating;
        console.log("Current Reviews: ", updatedProduct.reviews);
        cancelEdit(); // 수정 후 상태 초기화
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("후기와 별점을 입력하세요.");
    }
  }

  // 수정 상태 초기화 함수
  function cancelEdit() {
    editingReviewId = null; // 수정 중인 후기 ID 초기화
    editingReviewContent = ""; // 수정할 내용 초기화
    editingRating = 0; // 수정할 별점 초기화
  }

  // 후기 삭제 API
  async function deleteReview(reviewId) {
    if (confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      try {
        console.log("reviewId : ", reviewId);
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/reviews/${reviewId}`, // reviewId 사용
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("후기 삭제에 실패했습니다.");
        }

        // 리뷰를 삭제한 후, updatedProduct.reviews에서 해당 리뷰를 제거
        updatedProduct.reviews = updatedProduct.reviews.filter(
          (review) => review.id !== reviewId,
        ); // ID로 필터링하여 제거
        console.log("Current Reviews: ", updatedProduct.reviews);
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // 문의 수정 API
  async function updateInquiry(inquiryIndex) {
    const content = prompt(
      "수정할 문의 내용을 입력하세요:",
      updatedProduct.inquiries[inquiryIndex].content,
    );

    if (content) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryIndex}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          },
        );

        if (!response.ok) {
          throw new Error("문의 수정에 실패했습니다.");
        }

        updatedProduct.inquiries[inquiryIndex].content = content;
        console.log("Current Inquiries: ", updatedProduct.inquiries);
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // 문의 삭제 API
  async function deleteInquiry(inquiryIndex) {
    if (confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryIndex}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("문의 삭제에 실패했습니다.");
        }

        updatedProduct.inquiries.splice(inquiryIndex, 1);
        console.log("Current Inquiries: ", updatedProduct.inquiries);
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // 대댓글 추가 API
  function addReply(inquiryIndex) {
    if (newReply.trim() !== "") {
      updatedProduct.inquiries[inquiryIndex].replies.push({
        responder: "작성자", // 대댓글 작성자 (예시로 '작성자'로 설정)
        content: newReply,
        date: new Date(),
      });
      newReply = ""; // 입력 필드 초기화
      currentInquiryIndex = null; // 대댓글 입력 필드 닫기
      console.log(
        "Current Replies: ",
        updatedProduct.inquiries[inquiryIndex].replies,
      );
    } else {
      alert("대댓글 내용을 입력하세요.");
    }
  }

  function switchTab(tab) {
    activeTab = tab; // 활성화된 탭 전환
  }
</script>

<main>
  <h1 class="text-2xl font-bold">상품 조회</h1>

  <form on:submit class="mt-4">
    <!-- 상품 정보 입력 필드 -->
    <div>
      <label for="product-name" class="block text-sm font-medium"
        >상품 사진</label
      >
      <div class="mt-4 product-detail-img-container">
        <img
          src={`http://localhost:3000${updatedProduct.image}`}
          alt={updatedProduct.name}
          class="w-full h-48 object-cover rounded"
        />
      </div>
      <label for="product-name" class="block text-sm font-medium"
        >상품 이름</label
      >
      <input
        id="product-name"
        type="text"
        bind:value={updatedProduct.name}
        class="border rounded p-2 w-full"
        disabled
      />
    </div>
    <div class="mt-2">
      <label for="product-price" class="block text-sm font-medium">가격</label>
      <input
        id="product-price"
        type="number"
        bind:value={updatedProduct.price}
        class="border rounded p-2 w-full"
        disabled
      />
    </div>
    <div class="mt-2">
      <label for="product-seller" class="block text-sm font-medium"
        >판매자</label
      >
      <input
        id="product-seller"
        type="text"
        bind:value={updatedProduct.userName}
        class="border rounded p-2 w-full"
        disabled
      />
    </div>
    <div class="mt-2">
      <label for="product-rating" class="block text-sm font-medium"
        >판매자 평점</label
      >
      <input
        id="product-rating"
        type="number"
        bind:value={updatedProduct.rating}
        step="0.1"
        class="border rounded p-2 w-full"
        disabled
      />
    </div>
    <!-- 상품 설명란 추가 -->
    <div class="mt-2">
      <label for="product-description" class="block text-sm font-medium"
        >상품 설명</label
      >
      <textarea
        id="product-description"
        bind:value={updatedProduct.content}
        class="border rounded p-2 w-full"
        rows="4"
        disabled
      ></textarea>
    </div>
    <div class="mt-4">
      <Button
        on:click={() => goto(`/products/edit/${updatedProduct.id}`)}
        color="blue">수정</Button
      >
    </div>
  </form>

  <div class="mt-4 border"></div>

  <!-- 내비게이션 바 -->
  <div class="flex space-x-4 mt-4 mb-4">
    <button
      on:click={() => switchTab("reviews")}
      class={`p-2 rounded ${activeTab === "reviews" ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}
    >
      후기
    </button>
    <button
      on:click={() => switchTab("inquiries")}
      class={`p-2 rounded ${activeTab === "inquiries" ? "bg-green-500 text-white" : "bg-gray-200 text-black"}`}
    >
      문의
    </button>
  </div>

  <!-- 후기 섹션 -->
  {#if activeTab === "reviews"}
    <h2 class="text-xl font-semibold mt-4">후기 목록</h2>
    <ul>
      {#each updatedProduct.reviews as review (review.id)}
        <li class="border-b py-2">
          <strong> ID: {review.userId} </strong>
          {#if editingReviewId === review.id}
            <div>
              <input
                type="text"
                bind:value={editingReviewContent}
                class="border rounded p-2 w-full"
              />
              <div class="flex mt-2">
                {#each [1, 2, 3, 4, 5] as star}
                  <span
                    class="cursor-pointer text-2xl"
                    class:selected={editingRating >= star}
                    on:click={() => (editingRating = star)}
                  >
                    ★
                  </span>
                {/each}
              </div>
              <button
                on:click={() => updateReview(review.id)}
                class="bg-green-500 text-white p-2 rounded mt-2"
              >
                수정하기
              </button>
              <button
                on:click={cancelEdit}
                class="bg-gray-300 text-black p-2 rounded mt-2"
              >
                수정 취소
              </button>
            </div>
          {:else}
            <div>
              {review.content}
              <br />
              <span class="text-gray-500"
                >{parseDate(review.date).toLocaleDateString()}</span
              >
              - {review.rating} ⭐
              <div class="flex space-x-2 mt-2">
                <button
                  on:click={() => {
                    editingReviewContent = review.content; // 수정할 내용을 설정
                    editingRating = review.rating; // 수정할 평점을 설정
                    editingReviewId = review.id; // 수정 중인 후기 ID 설정
                  }}
                  class="text-blue-500">수정</button
                >
                <button
                  on:click={() => deleteReview(review.id)}
                  class="text-red-500">삭제</button
                >
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>

    <h2 class="text-xl font-semibold mt-4">후기 작성</h2>
    <input
      type="text"
      bind:value={newReview}
      placeholder="후기를 입력하세요..."
      class="border rounded p-2 w-full"
    />

    <div class="flex mt-2">
      {#each [1, 2, 3, 4, 5] as star}
        <span
          class="cursor-pointer text-2xl"
          class:selected={newRating >= star}
          on:click={() => (newRating = star)}
        >
          ★
        </span>
      {/each}
    </div>

    <button
      on:click={addReview}
      class="bg-green-500 text-white p-2 rounded mt-2"
    >
      후기 작성
    </button>
  {/if}

  <!-- 문의 섹션 -->
  {#if activeTab === "inquiries"}
    <h2 class="text-xl font-semibold mt-4">문의 목록</h2>
    <ul>
      {#each updatedProduct.inquiries as inquiry, index}
        <li class="border-b py-2">
          <strong>{inquiry.asker} ID: {inquiry.userId}</strong>
          {inquiry.content}
          <br />
          <span class="text-gray-500"
            >{parseDate(inquiry.date).toLocaleDateString()}</span
          >
          <button
            on:click={() => (currentInquiryIndex = index)}
            class="text-blue-500 ml-2">답변하기</button
          >
          {#if currentInquiryIndex === index}
            <div class="mt-2">
              <input
                type="text"
                bind:value={newReply}
                placeholder="답변을 입력하세요..."
                class="border rounded p-2 w-full"
              />
              <button
                on:click={() => addReply(index)}
                class="bg-green-500 text-white p-2 rounded mt-2"
                >답변 추가</button
              >
            </div>
          {/if}
          <div class="flex space-x-2 mt-2">
            <button on:click={() => updateInquiry(index)} class="text-blue-500"
              >수정</button
            >
            <button on:click={() => deleteInquiry(index)} class="text-red-500"
              >삭제</button
            >
          </div>
          <ul>
            {#each inquiry.replies as reply}
              <li class="ml-4 border-l pl-2 py-1">
                <strong>{reply.responder}</strong>: {reply.content} <br />
                <span class="text-gray-500"
                  >{parseDate(reply.date).toLocaleDateString()}</span
                >
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>

    <h2 class="text-xl font-semibold mt-4">문의 작성</h2>
    <input
      type="text"
      bind:value={newInquiry}
      placeholder="문의 내용을 입력하세요..."
      class="border rounded p-2 w-full"
    />

    <button
      on:click={addInquiry}
      class="bg-green-500 text-white p-2 rounded mt-2">문의 추가</button
    >
  {/if}
</main>

<style>
  main {
    padding: 1rem;
  }
  .selected {
    color: gold; /* 선택된 별의 색상 */
  }
  .product-detail-img-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* 수평 중앙 정렬 */
    justify-content: center; /* 수직 중앙 정렬 */
  }
  img {
    width: 70%; /* 이미지가 컨테이너에 맞춰 조정되도록 설정 */
    height: auto; /* 비율을 유지하며 높이 자동 조정 */
  }
</style>
