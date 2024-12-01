<script>
  import { Input, Button, Select, Textarea } from "flowbite-svelte";
  import { goto } from "$app/navigation"; // goto를 import 합니다.

  export let data; // 상품 정보 받기
  console.log("data : ", data);

  let updatedProduct = { ...data.product }; // 수정할 상품 정보 초기화

  function handleSubmit() {
    // 수정된 상품 정보를 서버에 전송하는 로직 추가
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

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updatedProduct.image = e.target.result; // 미리보기 이미지 업데이트
      };
      reader.readAsDataURL(file);
    }
  }
</script>

<main>
  <h1 class="text-2xl font-bold">상품 수정</h1>
  <form on:submit|preventDefault={handleSubmit} class="mt-4">
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
        bind:value={updatedProduct.name}
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
        bind:value={updatedProduct.description}
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
        on:click={handleDelete}
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
