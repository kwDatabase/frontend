<!-- src/routes/products/create.svelte -->
<script>
  import { goto } from '$app/navigation';
  import { Button, Input, Textarea } from 'flowbite-svelte';

  let newProduct = { name: '', price: '', image: '', description: '' };

  function addProduct() {
      if (newProduct.name && newProduct.price && newProduct.image && newProduct.description) {
          alert(`상품이 등록되었습니다: ${newProduct.name}, 가격: ${newProduct.price}`);
          // 여기서 실제 상품 등록 로직을 추가할 수 있습니다.
          goto('/products'); // 등록 후 목록 페이지로 이동
      } else {
          alert("모든 필드를 입력하세요.");
      }
  }

  function handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              newProduct.image = e.target.result; // 미리보기 이미지 업데이트
          };
          reader.readAsDataURL(file);
      }
  }
</script>

<main>
  <h1 class="text-2xl font-bold">상품 등록</h1>

  <Input type="text" placeholder="상품 이름" bind:value={newProduct.name} class="mt-4" />
  <Input type="number" placeholder="가격" bind:value={newProduct.price} class="mt-2" />
  
  <label class="block text-sm font-medium mt-4">상품 이미지</label>
  <Input type="file" accept="image/*" on:change={handleImageChange} class="mt-2" />
  
  <div class="mt-4 product-detail-img-container">
      {#if newProduct.image}
          <img src={newProduct.image} alt="미리보기" class="w-full h-48 object-cover rounded" />
      {/if}
  </div>

  <Textarea placeholder="상품 설명" bind:value={newProduct.description} class="mt-2" rows="4" />

  <Button on:click={addProduct} color="blue" class="mt-4 text-white">등록</Button>
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
      width: 100%; /* 이미지가 컨테이너에 맞춰 조정되도록 설정 */
      height: auto; /* 비율을 유지하며 높이 자동 조정 */
  }
</style>