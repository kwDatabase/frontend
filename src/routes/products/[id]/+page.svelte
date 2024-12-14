<script>
  import { Input, Button, Select, Textarea } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import { userInfo } from "$src/stores/auth";

  let loggedInUserId; // 로그인한 사용자 ID 저장
  // 사용자 정보 구독
  userInfo.subscribe((value) => {
    loggedInUserId = value?.id; // 사용자 ID를 가져옴 (없으면 undefined)
  });
  // 상품 수정 버튼 클릭 시 호출
  function handleEditProduct() {
    if (loggedInUserId === updatedProduct.userName) {
      // 작성자 ID와 로그인한 사용자 ID 비교
      goto(`/products/edit/${updatedProduct.id}`); // 수정 페이지로 이동
    } else {
      console.log("Debug: ", loggedInUserId, "and", updatedProduct.userId);
      alert("상품을 수정할 권한이 없습니다."); // 권한이 없을 경우 알림
    }
  }

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
    // 로그인 여부 확인
    if (!loggedInUserId) {
      alert("후기를 작성하려면 로그인해야 합니다."); // 로그인하지 않은 경우 알림
      return; // 함수 종료
    }

    // 상품 작성자 ID와 로그인한 사용자 ID 비교
    if (loggedInUserId === updatedProduct.userName) {
      alert("상품 작성자는 후기를 작성할 수 없습니다."); // 동일한 경우 알림
      return; // 함수 종료
    }

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
              user_id: loggedInUserId,
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
          userId: loggedInUserId,
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

    // 로그인한 사용자 ID와 후기 작성자 ID 비교
    if (loggedInUserId !== review.userId) {
      alert("이 후기의 수정 권한이 없습니다."); // 권한이 없을 경우 알림
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
    const review = updatedProduct.reviews.find((r) => r.id === reviewId);
    if (!review) {
      alert("해당 리뷰를 찾을 수 없습니다.");
      return;
    }

    // 로그인한 사용자 ID와 후기 작성자 ID 비교
    if (loggedInUserId !== review.userId) {
      alert("이 후기를 삭제할 권한이 없습니다."); // 권한이 없을 경우 알림
      return;
    }

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
    // 로그인 여부 확인
    if (!loggedInUserId) {
      alert("문의를 작성하려면 로그인해야 합니다."); // 로그인하지 않은 경우 알림
      return; // 함수 종료
    }

    // 상품 작성자 ID와 로그인한 사용자 ID 비교
    if (loggedInUserId === updatedProduct.userName) {
      alert("상품 작성자는 문의를 작성할 수 없습니다."); // 동일한 경우 알림
      return; // 함수 종료
    }

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
              asker: loggedInUserId,
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
          asker: loggedInUserId,
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

    // 로그인한 사용자 ID와 문의 작성자 ID 비교
    if (loggedInUserId !== inquiry.userId) {
      alert("이 문의의 수정 권한이 없습니다."); // 권한이 없을 경우 알림
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
    const inquiry = updatedProduct.inquiries.find((i) => i.id === inquiryId);
    if (!inquiry) {
      alert("해당 문의를 찾을 수 없습니다.");
      return;
    }

    // 로그인한 사용자 ID와 문의 작성자 ID 비교
    if (loggedInUserId !== inquiry.userId) {
      alert("이 문의의 수정 권한이 없습니다."); // 권한이 없을 경우 알림
      return;
    }

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

  // 문의답변 추가 API
  async function addReply(inquiryId) {
    if (loggedInUserId !== updatedProduct.userName) {
      console.log("checking: ", loggedInUserId, "and", updatedProduct.userName);
      alert("이 문의에 대한 답변 권한이 없습니다."); // 권한이 없을 경우 알림
      return;
    }

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
              responder: updatedProduct.userName,
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

        // 문의답변 추가 성공 후
        location.reload(); // 화면 새로고침
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("답변 내용을 입력하세요.");
    }
  }

  // 문의답변 수정 API
  async function updateReply(inquiryId) {
    if (loggedInUserId !== updatedProduct.userName) {
      console.log("checking: ", loggedInUserId, "and", updatedProduct.userName);
      alert("이 문의 답변에 대한 수정 권한이 없습니다."); // 권한이 없을 경우 알림
      return;
    }

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
          throw new Error("문의답변 수정에 실패했습니다.");
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
      alert("문의답변 내용을 입력하세요.");
    }
  }

  // 문의답변 삭제 API
  async function deleteReply(inquiryId) {
    if (loggedInUserId !== updatedProduct.userName) {
      console.log("checking: ", loggedInUserId, "and", updatedProduct.userName);
      alert("이 문의답변에 대한 삭제 권한이 없습니다."); // 권한이 없을 경우 알림
      return;
    }

    if (confirm("정말로 대댓글을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${updatedProduct.id}/inquiries/${inquiryId}/reply`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("문의답변 삭제에 실패했습니다.");
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

  // 상품 구매 API
  async function handlePurchase(product) {
    // 로그인 여부 확인
    if (!loggedInUserId) {
      alert("상품을 구매하려면 로그인해야 합니다."); // 로그인하지 않은 경우 알림
      return; // 함수 종료
    }

    // 로그인한 사용자 ID와 상품 소유자 ID 비교
    if (updatedProduct.userName === loggedInUserId) {
      alert("자신의 상품은 구매할 수 없습니다."); // 같은 사용자일 경우 알림
      return; // 함수 종료
    }

    const confirmation = confirm("정말 구매하시겠습니까?");
    if (confirmation) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/purchase/${product.id}`, // product.id 사용
          {
            method: "POST",
          },
        );

        if (!response.ok) {
          throw new Error("상품 구매에 실패했습니다.");
        }

        alert("구매 완료했습니다."); // 구매 완료 알림
        window.location.href = "/products"; // 리다이렉트
      } catch (error) {
        alert(error.message);
      }
    }
  }
</script>

<main>
  <div>
    <h1 class="text-2xl font-bold">상품 조회</h1>

    <div class="relative">
      <!-- 오버레이 추가 '판매 완료' -->
      {#if updatedProduct.status === 2}
        <div class="overlay">
          <p class="text-white text-lg font-semibold">판매 완료</p>
        </div>
      {/if}

      <!-- 오버레이 추가 '판매 중지' -->
      {#if updatedProduct.status === 3}
        <div class="overlay">
          <p class="text-white text-lg font-semibold">판매 중지</p>
        </div>
      {/if}

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
          <div class="mt-2">
            <label for="product-category" class="block text-sm font-medium"
              >카테고리</label
            >
            <input
              id="product-category"
              type="text"
              bind:value={updatedProduct.category_name}
              class="border rounded p-2 w-full"
              disabled
            />
          </div>
          <div class="mt-2">
            <label for="product-sub-category" class="block text-sm font-medium"
              >서브 카테고리</label
            >
            <input
              id="product-sub-category"
              type="text"
              bind:value={updatedProduct.sub_category_name}
              class="border rounded p-2 w-full"
              disabled
            />
          </div>

          <label for="product-price" class="block text-sm font-medium"
            >가격</label
          >
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
            bind:value={updatedProduct.nicName}
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
        <div class="flex mt-4">
          <Button
            class="mr-4"
            on:click={() => handlePurchase(updatedProduct)}
            color="blue">상품 구매</Button
          >
          <Button class="ml-auto" on:click={handleEditProduct} color="yellow"
            >상품 수정</Button
          >
        </div>
      </form>
    </div>
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
                    작성자: {updatedProduct.userName} | 작성일: {inquiry.replyDate
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
  </div>
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

  .overlay {
    position: absolute; /* 절대 위치 지정 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 검정색 투명도 0.5 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white; /* 텍스트 색상 */
    font-size: 1.5rem; /* 텍스트 크기 */
    opacity: 1; /* 기본적으로 보임 */
  }
</style>
