<script>
  import { Input, Button, Select, Textarea } from "flowbite-svelte";
  import { goto } from "$app/navigation"; // goto를 import 합니다.

  export let data; // 상품 정보 받기

  let updatedProduct = data && data.data ? { ...data.data.product } : {}; // 수정할 상품 정보 초기화
  let imageFile; // 이미지 파일을 저장할 변수

  // 상품 수정 API
  async function handleSubmit() {
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("image_file", imageFile); // 실제 이미지 파일
      }

      formData.append("image", updatedProduct.image); // 이미지 파일
      formData.append("title", updatedProduct.title); // 상품 이름
      formData.append("content", updatedProduct.content); // 상품 내용
      formData.append("price", updatedProduct.price); // 상품 가격
      formData.append("status_id", updatedProduct.status_id); // 상태 ID 추가
      formData.append("category_id", updatedProduct.category_id); // 카테고리 ID 추가
      formData.append("id", updatedProduct.id); // 상품 ID 추가

      // FormData 내용 확인
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await fetch(
        `http://localhost:3000/products/edit/${updatedProduct.id}`,
        {
          method: "PATCH",
          body: formData, // FormData로 요청
        },
      );

      if (response.ok) {
        alert("상품 수정 완료!");
        goto("/products"); // 수정 후 목록 페이지로 이동
      } else {
        alert("상품 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신에 오류가 발생했습니다.");
    }
  }

  // 상품 삭제 API
  async function deleteProduct() {
    try {
      const response = await fetch(`http://localhost:3000/products/edit/${updatedProduct.id}`, {
        method: "DELETE",
      });

      console.log("프론트 delete id : ",updatedProduct.id);

      if (response.ok) {
        alert("상품이 삭제되었습니다.");
        goto("/products"); // 삭제 후 목록 페이지로 이동
      } else {
        alert("상품 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("서버와의 통신에 오류가 발생했습니다.");
    }
  }

  // 이미지 가시화 함수
  function handleImageChange(event) {
    imageFile = event.target.files[0]; // 선택한 파일 저장
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updatedProduct.image = e.target.result; // 미리보기 이미지 업데이트
      };
      reader.readAsDataURL(imageFile);
    }
  }
</script>

<main>
  <h1 class="text-2xl font-bold">상품 수정</h1>
  <form on:submit|preventDefault={handleSubmit} class="mt-4">
    <div>
      <label for="product-image" class="block text-sm font-medium"
        >상품 사진</label
      >
      <div class="mt-4 product-detail-img-container">
        <img
          src={`http://localhost:3000${updatedProduct.image}`}
          alt={updatedProduct.name}
          class="w-full h-48 object-cover rounded"
        />
      </div>
      <input
        id="product-image"
        type="file"
        accept="image/*"
        on:change={handleImageChange}
        class="mt-2 mb-4"
      />

      <label for="product-name" class="block text-sm font-medium"
        >상품 이름</label
      >
      <input
        id="product-name"
        type="text"
        bind:value={updatedProduct.title}
        class="border rounded p-2 w-full"
      />
    </div>
    <div class="mt-2">
      <label for="product-price" class="block text-sm font-medium">가격</label>
      <input
        id="product-price"
        type="number"
        bind:value={updatedProduct.price}
        class="border rounded p-2 w-full"
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
        placeholder="상품에 대한 설명을 입력하세요..."
      ></textarea>
    </div>

    <div class="mt-4">
      <button type="submit" class="mt-4 bg-blue-500 text-white p-2 rounded">
        수정 완료
      </button>
      <button
        type="button"
        on:click={deleteProduct}
        class="bg-red-500 text-white p-2 rounded"
      >
        삭제
      </button>
    </div>
  </form>
</main>

<style>
  main {
    padding: 1rem;
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
