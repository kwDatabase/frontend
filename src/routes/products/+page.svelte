<script>
  import { onMount } from "svelte";
  import { Input, Button, Select } from "flowbite-svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn } from "$src/stores/auth"; // 로그인 상태 스토어 가져오기

  //////////////////////////
  ////// 로그인 관리 섹션 //////
  //////////////////////////

  let loggedIn = false; // 로그인 상태 변수
  // 로그인 상태 구독
  isLoggedIn.subscribe((value) => {
    loggedIn = value;
  });
  // 상품 등록 버튼 클릭 시 호출
  function handleRegisterProduct() {
    if (loggedIn) {
      goto("/products/create"); // 로그인 되어 있으면 상품 등록 페이지로 이동
    } else {
      alert("로그인이 필요한 기능입니다.");
      goto("/login"); // 로그인 안되어 있으면 로그인 페이지로 이동
    }
  }

  //////////////////////////
  /////// 상품 관리 섹션 //////
  //////////////////////////

  export let data;
  let searchQuery = "";
  let sortOption = "default"; // 정렬 기준 초기화
  let products = data.products;
  let filteredProducts = [...products]; // 초기 필터링된 제품 리스트

  let categories = []; // 카테고리 목록
  let subCategories = []; // 서브 카테고리 목록
  let selectedCategoryId = ""; // 선택된 카테고리 ID
  let selectedSubCategoryId = ""; // 선택된 서브 카테고리 ID
  let filteredSubCategories = []; // 필터링된 서브 카테고리 배열
  let newProduct = { categoryId: "", subCategoryId: "" }; // 새로운 상품 데이터


  // 카테고리, 서브 카테고리 호출 API
  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:3000/products/categories"); // API 호출
      if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.status}`);
      }
      const data = await response.json(); // 카테고리 및 서브 카테고리 데이터 가져오기
      categories = data.categories; // 카테고리 배열
      subCategories = data.subCategories; // 서브 카테고리 배열
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // 카테고리 선택 시 서브 카테고리 필터링
  function handleCategoryChange() {
    const selectedCategoryId = newProduct.categoryId; // 선택된 카테고리 ID
    filteredSubCategories = subCategories.filter(
      (subCategory) => subCategory.category_id == selectedCategoryId // ID로 필터링
    );
    newProduct.subCategoryId = ""; // 서브 카테고리 초기화
    filterProducts(); // 카테고리 변경 시 제품 필터링
  }

  // 서브 카테고리 선택 시 필터링
  function handleSubCategoryChange() {
    filterProducts(); // 서브 카테고리 변경 시 제품 필터링
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
  
  // 필터링된 제품 리스트 업데이트
  function filterProducts() {
    filteredProducts = products.filter((product) => {
      const matchesCategory = selectedCategoryId ? product.category_name == categories.find(cat => cat.id == selectedCategoryId).name : true;
      const matchesSubCategory = selectedSubCategoryId ? product.sub_category_name == subCategories.find(subCat => subCat.sub_id == selectedSubCategoryId).name : true;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSubCategory && matchesSearch;
    });
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
          case "recent":
            return parseDate(b.date) - parseDate(a.date);
          case "rating":
            return b.rating - a.rating; // 판매자 평점으로 정렬
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

  // 상품 조회수 증가 요청 API
  async function incrementViewCount(productId) {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}/views`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("조회수 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 조회 버튼 클릭 시 호출
  function handleViewProduct(product) {
    incrementViewCount(product.id); // 조회수 증가 요청
    goto(`/products/${product.id}`); // 상품 상세 페이지로 이동
  }

  onMount(fetchCategories);
</script>

<main class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-8">상품 조회</h1>

  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 카테고리 선택 -->
      <Select
        class="w-full"
        on:change={(event) => {
          newProduct.categoryId = event.target.value;
          selectedCategoryId = event.target.value;
          handleCategoryChange();
        }}
      >
        <option value="">모든 카테고리</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </Select>

      <!-- 서브 카테고리 선택 -->
      <Select
        class="w-full"
        on:change={(event) => {
          newProduct.subCategoryId = event.target.value;
          selectedSubCategoryId = event.target.value;
          handleSubCategoryChange();
        }}
        disabled={!filteredSubCategories.length}
      >
        <option value="">모든 서브 카테고리</option>
        {#each filteredSubCategories as subCategory}
          <option value={subCategory.sub_id}>{subCategory.name}</option>
        {/each}
      </Select>

      <!-- 검색창 -->
      <Input
        type="text"
        placeholder="상품을 검색하세요..."
        bind:value={searchQuery}
        on:input={filterProducts}
        class="w-full"
      />

      <!-- 정렬 기준 선택 -->
      <Select on:change={handleSortChange} class="w-full">
        <option value="default">정렬 기준 선택</option>
        <option value="priceAsc">가격 낮은 순</option>
        <option value="priceDesc">가격 높은 순</option>
        <option value="recent">신상품 순</option>
        <option value="rating">평점 순</option>
      </Select>
    </div>

    <!-- 상품 등록 버튼 -->
    <Button
      on:click={handleRegisterProduct}
      color="blue"
      class="mt-6 w-full md:w-auto"
    >
      상품 등록
    </Button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each filteredProducts as product}
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
        <div class="relative">
          <img
            src={product.image ? `http://localhost:3000${product.image}` : ''}
            alt={product.name}
            class="w-full h-64 object-cover"
            on:error={(e) => e.target.src = ''}
          />

          {#if product.status === 2}
            <div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <p class="text-white text-xl font-bold">판매 완료</p>
            </div>
          {/if}

          {#if product.status === 3}
            <div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <p class="text-white text-xl font-bold">판매 중지</p>
            </div>
          {/if}
        </div>

        <div class="p-5">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h3>
          <div class="space-y-2">
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{product.price.toLocaleString()}원</p>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <span class="mr-2">판매자:</span>
              <span class="font-medium">{product.nicName}</span>
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <span class="mr-2">평점:</span>
              <span class="text-yellow-400">{'⭐'.repeat(Math.round(product.rating))}</span>
              <span class="ml-1">({product.rating})</span>
            </div>
          </div>
          <Button
            on:click={() => handleViewProduct(product)}
            color="blue"
            class="w-full mt-4"
          >
            상세보기
          </Button>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  :global(body) {
    @apply bg-gray-100 dark:bg-gray-900;
  }
</style>
