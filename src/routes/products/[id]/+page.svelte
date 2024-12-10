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

  let editingInquiryId = null; // 현재 수정 중인 문의 ID
  let editingInquiryContent = ""; // 수정할 문의 내용

  let currentInquiryIndex = null; // 대댓글 입력 중인 문의 ID
  let newReply = ""; // 신규 대댓글 입력값
  let editingReplyContent = ""; // 수정할 대댓글 내용
  let editingReplyId = null; // 현재 수정 중인 대댓글 ID

  function startEditReply(inquiry) {
    editingReplyId = inquiry.id; // 수정할 대댓글 ID 설정
    editingReplyContent = inquiry.replyContent; // 현재 대댓글 내용 설정
  }

  function cancelEditReply() {
    editingReplyId = null; // 수정 모드 종료
  }

  // 문의 수정 시작 함수
  function startEditInquiry(inquiry) {
    editingInquiryId = inquiry.id; // 수정 중인 문의 ID 설정
    editingInquiryContent = inquiry.content; // 수정할 내용 설정
  }

  // 문의 수정 취소 함수
  function cancelEditInquiry() {
    editingInquiryId = null; // 수정 중인 문의 ID 초기화
    editingInquiryContent = ""; // 수정할 내용 초기화
  }

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

  // 사용자 평균 평점 계산 함수
  function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0; // 후기가 없으면 0 반환

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // 소수점 첫째자리까지 반올림
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
              user_id: "qwer",
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
          userId: "qwer",
          content: newReview,
          date: new Date().toISOString(),
          rating: newRating,
        });

        // 사용자 평균 평점 업데이트
        updatedProduct.userRating = calculateAverageRating(
          updatedProduct.reviews,
        );

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

  // 후기 삭제 API
  async function deleteReview(reviewId) {
    if (confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/reviews/${reviewId}`,
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
        );

        // 사용자 평균 평점 업데이트
        updatedProduct.userRating = calculateAverageRating(
          updatedProduct.reviews,
        );
        console.log("Current Reviews: ", updatedProduct.reviews);
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // 수정 상태 초기화 함수
  function cancelEdit() {
    editingReviewId = null; // 수정 중인 후기 ID 초기화
    editingReviewContent = ""; // 수정할 내용 초기화
    editingRating = 0; // 수정할 별점 초기화
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

        // 페이지 새로고침
        window.location.reload(); // 새로고침

        console.log("Current Inquiries: ", updatedProduct.inquiries);
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("문의 내용을 입력하세요.");
    }
  }

  // 문의 수정 API
  async function updateInquiry(inquiryId) {
    const inquiry = updatedProduct.inquiries.find((i) => i.id === inquiryId);
    if (!inquiry) {
      alert("해당 문의를 찾을 수 없습니다.");
      return;
    }

    if (editingInquiryContent.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: editingInquiryContent }),
          },
        );

        if (!response.ok) {
          throw new Error("문의 수정에 실패했습니다.");
        }

        // 문의 수정
        inquiry.content = editingInquiryContent;
        console.log("Current Inquiries: ", updatedProduct.inquiries);
        cancelEditInquiry(); // 수정 후 상태 초기화
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("문의 내용을 입력하세요.");
    }
  }

  // 문의 삭제 API
  async function deleteInquiry(inquiryId) {
    if (confirm("정말로 이 문의를 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("문의 삭제에 실패했습니다.");
        }

        // 삭제 성공 후, 페이지 새로고침
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // 대댓글 추가 API
  async function addReply(inquiryId) {
    if (newReply.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryId}/reply`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              responder: "Anonymous",
              content: newReply,
            }),
          },
        );

        if (!response.ok) {
          throw new Error("대댓글 추가에 실패했습니다.");
        }

        const inquiry = updatedProduct.inquiries.find(
          (i) => i.id === inquiryId,
        );
        inquiry.reply_content = newReply; // 대댓글 내용 업데이트
        newReply = ""; // 대댓글 입력 필드 초기화

        // 대댓글 추가 성공 후
        location.reload(); // 화면 새로고침
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("대댓글 내용을 입력하세요.");
    }
  }

  // 대댓글 수정 API
  async function updateReply(inquiryId) {
    if (editingReplyContent.trim() !== "") {
      try {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD 형식
        const formattedTime = now.toTimeString().slice(0, 5).replace(":", ""); // HHMM 형식

        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryId}/reply`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: editingReplyContent,
              reply_date: formattedDate, // 날짜 추가
              reply_time: formattedTime, // 시간 추가
            }),
          },
        );

        if (!response.ok) {
          throw new Error("대댓글 수정에 실패했습니다.");
        }

        // 대댓글 내용 업데이트
        const inquiry = updatedProduct.inquiries.find(
          (i) => i.id === inquiryId,
        );
        inquiry.reply_content = editingReplyContent; // 대댓글 내용 업데이트
        inquiry.replyDate = formattedDate; // 날짜 업데이트
        inquiry.replyTime = formattedTime; // 시간 업데이트
        editingReplyContent = ""; // 수정 입력 필드 초기화
        editingReplyId = null; // 수정 모드 종료

        location.reload(); // 화면 새로고침
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("대댓글 내용을 입력하세요.");
    }
  }

  // 대댓글 삭제 API
  async function deleteReply(inquiryId) {
    if (confirm("정말로 대댓글을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryId}/reply`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("대댓글 삭제에 실패했습니다.");
        }

        const inquiry = updatedProduct.inquiries.find(
          (i) => i.id === inquiryId,
        );
        inquiry.reply_content = null; // 대댓글 내용 초기화
        location.reload(); // 화면 새로고침
      } catch (error) {
        alert(error.message);
      }
    }
  }

  function switchTab(tab) {
    activeTab = tab; // 활성화된 탭 전환
  }

  console.log(updatedProduct.inquiries);
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

          {#if editingInquiryId === inquiry.id}
            <div>
              <input
                type="text"
                bind:value={editingInquiryContent}
                class="border rounded p-2 w-full"
              />
              <button
                on:click={() => updateInquiry(inquiry.id)}
                class="bg-green-500 text-white p-2 rounded mt-2"
              >
                수정하기
              </button>
              <button
                on:click={cancelEditInquiry}
                class="bg-gray-300 text-black p-2 rounded mt-2"
              >
                수정 취소
              </button>
            </div>
          {:else}
            <div>
              {inquiry.content}
              <br />
              <span class="text-gray-500"
                >{parseDate(inquiry.date).toLocaleDateString()}</span
              >
              <div class="flex space-x-2 mt-2">
                <button
                  on:click={() => startEditInquiry(inquiry)}
                  class="text-blue-500">수정</button
                >
                <button
                  on:click={() => deleteInquiry(inquiry.id)}
                  class="text-red-500">삭제</button
                >
              </div>
            </div>
          {/if}

          <!-- 문의 답변 부분 -->
          {#if inquiry.replyContent}
            <div class="mt-2 pl-4 border-l-4 border-blue-500">
              {#if editingReplyId === inquiry.id}
                <!-- 수정 모드 체크 -->
                <strong>→ 문의 답변: </strong>
                <input
                  type="text"
                  bind:value={editingReplyContent}
                  class="border rounded p-2 w-full"
                />
                <div class="mt-2">
                  <button
                    on:click={() => updateReply(inquiry.id)}
                    class="bg-green-500 text-white p-2 rounded mt-2"
                  >
                    수정 완료
                  </button>
                  <button
                    on:click={() => cancelEditReply()}
                    class="bg-gray-300 text-black p-2 rounded mt-2"
                  >
                    수정 취소
                  </button>
                </div>
              {:else}
                <strong>→ 문의 답변: </strong>
                {inquiry.replyContent}
                <br />
                <span class="text-gray-500 ml-4">
                  작성자: {inquiry.userId} | 작성일: {inquiry.replyDate
                    ? parseDate(inquiry.replyDate)?.toLocaleDateString() ||
                      "작성일 없음"
                    : "작성일 없음"}
                </span>
                <div class="mt-2 ml-4">
                  <button
                    on:click={() => {
                      startEditReply(inquiry); // 수정 모드로 전환
                    }}
                    class="text-blue-500 ml-2">수정</button
                  >
                  <button
                    on:click={() => deleteReply(inquiry.id)}
                    class="text-red-500 ml-2">삭제</button
                  >
                </div>
              {/if}
            </div>
          {:else}
            <div class="mt-2">
              <button
                on:click={() => (currentInquiryIndex = inquiry.id)}
                class="text-blue-500 ml-2">답변하기</button
              >
              {#if currentInquiryIndex === inquiry.id}
                <div class="mt-2">
                  <input
                    type="text"
                    bind:value={newReply}
                    placeholder="답변을 입력하세요..."
                    class="border rounded p-2 w-full"
                  />
                  <button
                    on:click={() => addReply(inquiry.id)}
                    class="bg-green-500 text-white p-2 rounded mt-2"
                  >
                    문의 답변 추가
                  </button>
                </div>
              {/if}
            </div>
          {/if}
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
