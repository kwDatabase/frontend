import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const response = await fetch(`http://localhost:3000/products/edit/${params.id}`); // 상품 수정 정보 API 호출

    if (!response.ok) {
        throw error(response.status, 'Failed to load product');
    }

    const product = await response.json(); // 상품 데이터 가져오기

    return {
        data: { product } // 'data'라는 이름으로 export
    };
};