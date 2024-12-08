import { error } from '@sveltejs/kit';

export const load = async () => {
    const response = await fetch('http://localhost:3000/products/categories'); // API 호출
    if (!response.ok) {
        throw error(response.status, 'Failed to load categories');
    }
    const data = await response.json(); // 카테고리 및 서브 카테고리 데이터 가져오기

    return {
        categories: data.categories, // 카테고리 배열
        subCategories: data.subCategories // 서브 카테고리 배열
    };
};