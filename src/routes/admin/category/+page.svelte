<script>
    import { Button, Input, Select } from "flowbite-svelte";
    import { onMount } from "svelte";
  
    let category = [];
    let newCategory = "";
    let selectedCategory = 0;
    let newSubCategory = "";
    let selectedSubCategory = "";
    let productName = "";
  
    let editCategoryName = "";
    let editSubCategoryName = "";
    let editingCategory = null;
    let editingSubCategory = null;
  
    const apiBaseUrl = "http://localhost:3000"; // API Base URL
  
    // Fetch category on mount
    onMount(async () => {
      await fetchCategory();
    });
  
    // Fetch category from the server
    const fetchCategory = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/category`);
        if (!response.ok) throw new Error("Failed to fetch category");
        category = await response.json();
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };
  
    // Add a new category
    const addCategory = async () => {
      if (newCategory.trim()) {
        if(newCategory.length > 20) {
          alert('카테고리 이름은 최대 20자입니다.');
          return;
        }
        try {
          const checkResponse = await fetch(`${apiBaseUrl}/category/check/${newCategory.trim()}`);
          const { exists } = await checkResponse.json();
          
          if (exists) {
            alert('이미 존재하는 카테고리 이름입니다.');
            return;
          }

          const response = await fetch(`${apiBaseUrl}/category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCategory }),
          });
          if (!response.ok) throw new Error("Failed to add category");
          newCategory = "";
          await fetchCategory();
        } catch (error) {
          console.error("Error adding category:", error);
        }
      }
    };
    let newSubCategories = {};
    
    // 서브카테고리 추가 함수 수정
    const addSubCategory = async (categoryId) => {
      if (categoryId && newSubCategories[categoryId]?.trim()) {
        if(newSubCategories[categoryId].length > 20) {
          alert('서브카테고리 이름은 최대 20자입니다.');
          return;
        }
        try {
          const response = await fetch(`${apiBaseUrl}/category/${categoryId}/subcategory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newSubCategories[categoryId] }),
          });
          if (!response.ok) throw new Error("Failed to add subcategory");
          newSubCategories[categoryId] = ""; // 해당 카테고리의 입력값만 초기화
          await fetchCategory();
        } catch (error) {
          console.error("Error adding subcategory:", error);
        }
      }
    };
  
    // Delete a category
    const deleteCategory = async (categoryId) => {
      try {
        const response = await fetch(`${apiBaseUrl}/category/${categoryId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete category");
        await fetchCategory();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };
  
    // Delete a subcategory
    const deleteSubCategory = async (categoryId, subCategoryId) => {
      try {
        const response = await fetch(`${apiBaseUrl}/category/${categoryId}/subcategory/${subCategoryId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete subcategory");
        await fetchCategory();
      } catch (error) {
        console.error("Error deleting subcategory:", error);
      }
    };
  
    // Edit a category
    const saveEditCategory = async () => {
      if (editCategoryName.trim() && editingCategory) {
        if(editCategoryName.length > 20) {
          alert('카테고리 이름은 최대 20자입니다.');
          return;
        }
        try {
          const response = await fetch(`${apiBaseUrl}/category/${editingCategory.Id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editCategoryName }),
          });
          if (!response.ok) throw new Error("Failed to edit category");
          editingCategory = null;
          editCategoryName = "";
          await fetchCategory();
        } catch (error) {
          console.error("Error editing category:", error);
        }
      }
    };
  
    // Edit a subcategory
    const saveEditSubCategory = async () => {
      if (editSubCategoryName.trim() && editingSubCategory) {
        if(editSubCategoryName.length > 20) {
          alert('서브카테고리 이름은 최대 20자입니다.');
          return;
        }
        const { category, sub_category } = editingSubCategory;
        try {
          const response = await fetch(`${apiBaseUrl}/category/${category.Id}/subcategory/${sub_category.sub_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editSubCategoryName }),
          });
          if (!response.ok) throw new Error("Failed to edit subcategory");
          editingSubCategory = null;
          editSubCategoryName = "";
          await fetchCategory();
        } catch (error) {
          console.error("Error editing subcategory:", error);
        }
      }
    };
  </script>  
  <div class="p-8 max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
    <div class="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        카테고리 관리
      </h2>
      <div class="flex gap-3">
        <Input
          bind:value={newCategory}
          placeholder="새 카테고리 이름을 입력하세요"
          class="flex-1"
        />
        <Button 
          on:click={addCategory}
          color="alternative"
        >
          추가
        </Button>
      </div>
    </div>
    <div class="space-y-4">
      {#if category.length > 0}
        {#each category as category}
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              {#if editingCategory === category}
                <div class="flex-1 mr-4">
                  <Input 
                    bind:value={editCategoryName}
                    class="w-full"
                  />
                </div>
                <div class="flex gap-2">
                  <Button 
                    on:click={saveEditCategory}
                    color="alternative"
                  >
                    저장
                  </Button>
                  <Button 
                    on:click={() => (editingCategory = null)}
                    color="light"
                  >
                    취소
                  </Button>
                </div>
              {:else}
                <h3 class="text-lg font-medium text-gray-800 dark:text-white">{category.name}</h3>
                <div class="flex items-center gap-2 mb-2">
                  <Button 
                    on:click={() => category.isSubCategoryVisible = !category.isSubCategoryVisible}
                  >
                    {#if category.isSubCategoryVisible}
                    <span>▼ 서브카테고리 숨기기</span>
                  {:else}
                      <span>▶ 서브카테고리 보기</span>
                    {/if}
                  </Button>
                  <Button 
                    on:click={() => {
                      editingCategory = category
                        editCategoryName = category.name
                      }}
                    color="blue"
                  >
                    수정
                  </Button>
                  <Button 
                    on:click={() => {
                      if(confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
                        deleteCategory(category.Id)
                      }
                    }}
                    color="red"
                  >
                    삭제
                  </Button>
                </div>
              {/if}
            </div>
            <div class="ml-6 space-y-2">
              {#if category.sub_category?.length > 0}
                {#if category.isSubCategoryVisible || editingCategory === category}
                  {#each category.sub_category as sub_category}
                    <div class="flex items-center justify-between bg-white dark:bg-gray-600 p-3 rounded shadow-sm">
                      {#if editingSubCategory?.category === category && editingSubCategory?.sub_category === sub_category}
                        <div class="flex-1 mr-4">
                          <Input 
                            bind:value={editSubCategoryName}
                            class="w-full"
                            placeholder="수정할 이름을 입력하세요"
                          />
                        </div>
                        <div class="flex items-center gap-3 mb-2">
                          <Button 
                            on:click={saveEditSubCategory}
                            color="alternative"
                          >
                            저장
                          </Button>
                          <Button 
                            on:click={() => (editingSubCategory = null)}
                            color="light"
                          >
                            취소
                          </Button>
                        </div>
                      {:else}
                        <span class="text-gray-700 dark:text-gray-200">{sub_category.name}</span>
                        <div class="flex items-center gap-3 mb-2">
                          <Button 
                            on:click={() => {
                              editingSubCategory = {category, sub_category};
                              editSubCategoryName = sub_category.name;
                            }}
                            color="blue"
                          >
                            수정
                          </Button>
                          <Button 
                            on:click={() => {
                              if(confirm('정말로 이 서브카테고리를 삭제하시겠습니까?')) {
                                deleteSubCategory(category.Id, sub_category.sub_id)
                              }
                            }}
                            color="red"
                          >
                            삭제
                          </Button>
                        </div>
                      {/if}
                    </div>
                  {/each}
                {/if}
              {/if}
              <div class="flex gap-2 mt-3">
                <Input
                    bind:value={newSubCategories[category.Id]}
                    placeholder="새 서브카테고리 이름을 입력하세요"
                    class="flex-1"
                />
                <Button 
                    on:click={() => addSubCategory(category.Id)}
                    color="alternative"
                >
                    추가
                </Button>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p class="text-gray-500 dark:text-gray-400">
            등록된 카테고리가 없습니다. 새로운 카테고리를 추가해보세요!
          </p>
        </div>
      {/if}
    </div>
  </div>