<script>
  import { Input, Button, Select, Textarea } from "flowbite-svelte";
  import { goto } from "$app/navigation"; // goto를 import 합니다.

  export let data; // 상품 정보 받기
  console.log("data : ", data);

  let updatedProduct = { ...data.product }; // 수정할 상품 정보 초기화
  let newReview = ""; // 신규 후기 입력값
  let newInquiry = ""; // 신규 문의 입력값
  let selectedRating = 0; // 선택된 별점
  let activeTab = "reviews"; // 현재 활성화된 탭 (reviews, inquiries)

  // 대댓글 입력값
  let newReply = ""; // 대댓글 입력값
  let currentInquiryIndex = null; // 현재 대댓글을 작성할 문의 인덱스

  function handleSubmit() {
    console.log("수정된 상품:", updatedProduct);
    alert("상품 수정 완료!");
    goto("/products"); // 수정 후 목록 페이지로 이동
  }

  function handleDelete() {
    const confirmDelete = confirm("정말로 이 상품을 삭제하시겠습니까?");
    if (confirmDelete) {
      console.log(`상품 ${updatedProduct.name}이(가) 삭제되었습니다.`);
      alert("상품이 삭제되었습니다.");
      goto("/products"); // 삭제 후 목록 페이지로 이동
    }
  }

  function addReview() {
    if (newReview.trim() !== "" && selectedRating > 0) {
      updatedProduct.reviews.push({
        reviewer: "Anonymous", // 작성자 이름을 익명으로 설정 (추후에 수정 가능)
        content: newReview,
        date: new Date(),
        rating: selectedRating, // 별점 추가
      });
      newReview = ""; // 입력 필드 초기화
      selectedRating = 0; // 별점 초기화
      console.log("Current Reviews: ", updatedProduct.reviews);
    } else {
      alert("후기와 별점을 입력하세요.");
    }
  }

  function addInquiry() {
    if (newInquiry.trim() !== "") {
      updatedProduct.inquiries.push({
        asker: "Anonymous",
        content: newInquiry,
        date: new Date(),
        replies: [], // 대댓글 배열 추가
      });
      newInquiry = ""; // 입력 필드 초기화
      console.log("Current Inquiries: ", updatedProduct.inquiries);
    } else {
      alert("문의 내용을 입력하세요.");
    }
  }

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

  <form on:submit|preventDefault={handleSubmit} class="mt-4">
    <!-- 상품 정보 입력 필드 -->
    <div>
      <label for="product-name" class="block text-sm font-medium"
        >상품 사진</label
      >
      <div class="mt-4 product-detail-img-container">
        <img
          src={updatedProduct.image}
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
        bind:value={updatedProduct.seller}
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
        bind:value={updatedProduct.description}
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
      {#each updatedProduct.reviews as review}
        <li class="border-b py-2">
          <strong>{review.reviewer}</strong>: {review.content} <br />
          <span class="text-gray-500">{review.date.toLocaleDateString()}</span>
          - {review.rating} ⭐
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
          class:selected={selectedRating >= star}
          on:click={() => (selectedRating = star)}
        >
          ★
        </span>
      {/each}
    </div>

    <button
      on:click={addReview}
      class="bg-green-500 text-white p-2 rounded mt-2">후기 추가</button
    >
  {/if}

  <!-- 문의 섹션 -->
  {#if activeTab === "inquiries"}
    <h2 class="text-xl font-semibold mt-4">문의 목록</h2>
    <ul>
      {#each updatedProduct.inquiries as inquiry, index}
        <li class="border-b py-2">
          <strong>{inquiry.asker}</strong>: {inquiry.content} <br />
          <span class="text-gray-500">{inquiry.date.toLocaleDateString()}</span>
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
          <ul>
            {#each inquiry.replies as reply}
              <li class="ml-4 border-l pl-2 py-1">
                <strong>{reply.responder}</strong>: {reply.content} <br />
                <span class="text-gray-500"
                  >{reply.date.toLocaleDateString()}</span
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
