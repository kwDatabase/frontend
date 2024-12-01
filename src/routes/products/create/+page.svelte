<!-- src/routes/products/create.svelte -->
<script>
    import { goto } from '$app/navigation';
    import { Button, Input } from 'flowbite-svelte';
  
    let newProduct = { name: '', price: '' };
  
    function addProduct() {
      if (newProduct.name && newProduct.price) {
        alert(`상품이 등록되었습니다: ${newProduct.name}, 가격: ${newProduct.price}`);
        goto('/products'); // 등록 후 목록 페이지로 이동
      }
    }
  </script>
  
  <main>
    <h1 class="text-2xl font-bold">상품 등록</h1>
    <Input type="text" placeholder="상품 이름" bind:value={newProduct.name} class="mt-4" />
    <Input type="number" placeholder="가격" bind:value={newProduct.price} class="mt-2" />
    <Button on:click={addProduct} color="blue" class="mt-4 text-white">등록</Button>
  </main>
  
  <style>
    main {
      padding: 1rem;
    }
  </style>