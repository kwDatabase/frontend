import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const response = await fetch(`http://localhost:3000/products/${params.id}`); // 상품 상세 정보 API 호출

    if (!response.ok) {
        throw error(response.status, 'Failed to load product');
    }

    const product = await response.json(); // 상품 데이터 가져오기

    console.log("상세 조회 product: ", product);

    return {
        product: {
            id: product.id,
            name: product.title,
            image: product.image,
            price: product.price,
            content: product.content,
            rating: product.user_rating || 0,
            userName: product.user_name, // 사용자 이름
            reviews: Array.isArray(product.reviews) ? product.reviews : [], // 유효성 검사
            inquiries: Array.isArray(product.inquiries) ? product.inquiries : [] // 유효성 검사
        }
    };
};