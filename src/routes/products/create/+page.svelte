<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Button, Input, Textarea, Select } from "flowbite-svelte";
    import { userInfo } from "$src/stores/auth";

    // 사용자 로그인 정보
    let userId; // 로그인한 사용자의 ID를 저장할 변수
    userInfo.subscribe((value) => {
        userId = value?.id; // 사용자 ID를 가져옴 (없으면 undefined)
    });


    let newProduct = {
        name: "",
        price: "",
        image: "",
        content: "",
        categoryId: "",
        subCategoryId: "",
    };
    let imageFile; // 이미지 파일을 저장할 변수
    export let data;
    export let categories = data.categories; // load 함수에서 전달된 카테고리 배열
    export let subCategories = data.subCategories; // load 함수에서 전달된 서브 카테고리 배열
    let filteredSubCategories = []; // 선택된 카테고리에 해당하는 서브 카테고리 저장

    // 카테고리 선택 시 서브 카테고리 필터링
    function handleCategoryChange() {
        const selectedCategoryId = newProduct.categoryId;
        filteredSubCategories = subCategories.filter(
            (subCategory) => subCategory.category_id === selectedCategoryId,
        );
        newProduct.subCategoryId = ""; // 서브 카테고리 초기화
    }

    async function addProduct() {
        if (
            newProduct.name &&
            newProduct.price &&
            imageFile &&
            newProduct.content &&
            newProduct.categoryId &&
            newProduct.subCategoryId
        ) {
            try {
                const formData = new FormData();
                console.log("addProduct entry");
                formData.append("image_file", imageFile); // 실제 이미지 파일
                formData.append("title", newProduct.name);
                formData.append("content", newProduct.content);
                formData.append("price", newProduct.price);
                formData.append("category_id", newProduct.categoryId);
                formData.append("sub_category_id", newProduct.subCategoryId);
                formData.append("user_id", userId); // 사용자 ID 추가

                const response = await fetch(
                    "http://localhost:3000/products/create",
                    {
                        method: "POST",
                        body: formData,
                    },
                );
                console.log("form data contents");
                for (const [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                console.log("response data: ", response);

                if (response.ok) {
                    const result = await response.json();
                    alert(
                        `상품이 등록되었습니다: ${result.title}, 가격: ${result.price}`,
                    );
                    goto("/products"); // 등록 후 목록 페이지로 이동
                } else {
                    alert("상품 등록에 실패했습니다.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("서버와의 통신에 오류가 발생했습니다.");
            }
        } else {
            alert("모든 필드를 입력하세요.");
        }
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            imageFile = file; // 이미지 파일을 변수에 저장
            const reader = new FileReader();
            reader.onload = (e) => {
                newProduct.image = e.target.result; // 미리보기 이미지 업데이트
            };
            reader.readAsDataURL(file);
        }
    }

    console.log("호출된 카테고리 명단 : ", categories, subCategories);
</script>

<main class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">상품 등록</h1>

    <div class="space-y-6">
        <div class="form-group">
            <Input
                type="text"
                placeholder="상품 이름을 입력하세요"
                bind:value={newProduct.name}
                class="focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div class="form-group">
            <Input
                type="number"
                placeholder="가격을 입력하세요"
                bind:value={newProduct.price}
                class="focus:ring-blue-500 focus:border-blue-500"
            />
        </div>

        <div class="form-group">
            <label class="block text-sm font-semibold text-gray-700 mb-2">카테고리</label>
            <Select
                bind:value={newProduct.categoryId}
                class="w-full rounded-lg"
                on:change={handleCategoryChange}
            >
                <option value="" disabled selected>카테고리를 선택하세요</option>
                {#each categories as category}
                    <option value={category.id}>{category.name}</option>
                {/each}
            </Select>
        </div>

        <div class="form-group">
            <label class="block text-sm font-semibold text-gray-700 mb-2">서브 카테고리</label>
            <Select bind:value={newProduct.subCategoryId} class="w-full rounded-lg">
                <option value="" disabled selected>서브 카테고리를 선택하세요</option>
                {#each filteredSubCategories as subCategory}
                    <option value={subCategory.sub_id}>{subCategory.name}</option>
                {/each}
            </Select>
        </div>

        <div class="form-group">
            <label class="block text-sm font-semibold text-gray-700 mb-2">상품 이미지</label>
            <Input
                type="file"
                accept="image/*"
                on:change={handleImageChange}
                class="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
        </div>

        <div class="mt-4 product-detail-img-container">
            {#if newProduct.image}
                <img
                    src={newProduct.image}
                    alt="미리보기"
                    class="w-full max-h-96 object-contain rounded-lg shadow-md"
                />
            {/if}
        </div>

        <div class="form-group">
            <Textarea
                placeholder="상품에 대한 자세한 설명을 입력하세요"
                bind:value={newProduct.content}
                class="w-full rounded-lg focus:ring-blue-500 focus:border-blue-500"
                rows="6"
            />
        </div>

        <Button 
            on:click={addProduct} 
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
            상품 등록하기
        </Button>
    </div>
</main>

<style>
    main {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
    .form-group {
        margin-bottom: 1.5rem;
    }
    .product-detail-img-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 1.5rem 0;
    }
    img {
        max-width: 100%;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
</style>
