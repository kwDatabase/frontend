<script>
  import { Input, Button, Select } from "flowbite-svelte";
  import { goto } from "$app/navigation"; // goto를 import 합니다.

  export let data;
  console.log("data: ", data);

  let searchQuery = "";
  let sortOption = "default"; // 정렬 기준 초기화

  let products = data.products;
  
  let filteredProducts = [...products]; // 초기 필터링된 제품 리스트

  function filterProducts() {
    // 검색 쿼리로 필터링
    filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    sortProducts(); // 필터링 후 정렬
  }

  function deleteProduct(id) {
    products = products.filter((product) => product.id !== id);
    filterProducts(); // 삭제 후 필터링 및 정렬
  }

  function sortProducts() {
    if (sortOption !== "default") {
      // 새로운 배열 생성하여 정렬
      filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
          case "priceAsc":
            return a.price - b.price;
          case "priceDesc":
            return b.price - a.price;
          case "popularity":
            return b.popularity - a.popularity;
          case "recent":
            return b.recentDate - a.recentDate;
          case "rating":
            return b.rating - a.rating; // 판매자 평점으로 정렬
          case "discount":
            return b.discount - a.discount;
          case "stock":
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
    }
  }

  // 정렬 기준이 변화할 때 호출
  function handleSortChange(event) {
    sortOption = event.target.value;
    sortProducts(); // 정렬 기준에 따라 상품 정렬
  }
</script>

<main>
  <h1 class="text-2xl font-bold">상품 조회</h1>
  <Input
    type="text"
    placeholder="상품을 검색하세요..."
    bind:value={searchQuery}
    on:input={filterProducts}
    class="mt-4"
  />

  <!-- 정렬 기준 선택 -->
  <Select on:change={handleSortChange} class="mt-4">
    <option value="default">정렬 기준 선택</option>
    <option value="priceAsc">가격 낮은 순</option>
    <option value="priceDesc">가격 높은 순</option>
    <option value="popularity">인기 순</option>
    <option value="recent">신상품 순</option>
    <option value="rating">평점 순</option> <!-- 판매자 평점 -->
    <option value="discount">할인율 순</option>
    <option value="stock">재고량 순</option>
  </Select>

  <!-- 상품 등록 버튼 -->
  <Button on:click={() => goto("/products/create")} color="blue" class="mt-4 text-white">상품 등록</Button>

  <h2 class="text-xl font-semibold mt-4">검색 결과:</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {#each filteredProducts as product}
      <div class="border rounded-lg overflow-hidden shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold">{product.name}</h3>
          <p class="text-gray-500">{product.price}원</p>
          <p class="text-gray-500">판매자: {product.seller}</p>
          <p class="text-gray-500">판매자 평점: {product.rating} ⭐</p> <!-- 판매자 평점 표시 -->
          <div class="flex justify-end items-center">
            <Button on:click={() => goto(`/products/${product.id}`)} color="green">조회</Button> <!-- 조회 버튼 추가 -->
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    padding: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
</style>