<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Button, Input, Textarea, Select } from "flowbite-svelte";

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
                // 이미지 파일 추가
                formData.append("image_file", imageFile); // 실제 이미지 파일

                // 다른 필드 추가
                formData.append("title", newProduct.name);
                formData.append("content", newProduct.content);
                formData.append("price", newProduct.price);
                formData.append("category_id", newProduct.categoryId);
                formData.append("sub_category_id", newProduct.subCategoryId);

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

<main>
    <h1 class="text-2xl font-bold">상품 등록</h1>

    <Input
        type="text"
        placeholder="상품 이름"
        bind:value={newProduct.name}
        class="mt-4"
    />
    <Input
        type="number"
        placeholder="가격"
        bind:value={newProduct.price}
        class="mt-2"
    />

    <label class="block text-sm font-medium mt-4">카테고리</label>
    <Select
        bind:value={newProduct.categoryId}
        class="mt-2"
        on:change={handleCategoryChange}
    >
        <option value="" disabled selected>카테고리를 선택하세요</option>
        {#each categories as category}
            <option value={category.id}>{category.name}</option>
        {/each}
    </Select>

    <label class="block text-sm font-medium mt-4">서브 카테고리</label>
    <Select bind:value={newProduct.subCategoryId} class="mt-2">
        <option value="" disabled selected>서브 카테고리를 선택하세요</option>
        {#each filteredSubCategories as subCategory}
            <option value={subCategory.sub_id}>{subCategory.name}</option>
        {/each}
    </Select>

    <label class="block text-sm font-medium mt-4">상품 이미지</label>
    <Input
        type="file"
        accept="image/*"
        on:change={handleImageChange}
        class="mt-2"
    />

    <div class="mt-4 product-detail-img-container">
        {#if newProduct.image}
            <img
                src={newProduct.image}
                alt="미리보기"
                class="w-full h-48 object-cover rounded"
            />
        {/if}
    </div>

    <Textarea
        placeholder="상품 설명"
        bind:value={newProduct.content}
        class="mt-2"
        rows="4"
    />

    <Button on:click={addProduct} color="blue" class="mt-4 text-white"
        >등록</Button
    >
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
