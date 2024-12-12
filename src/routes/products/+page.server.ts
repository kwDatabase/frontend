import { PRODUCTS } from '../../lib/sampleData/products.ts';

export const load = async () => {
    const products = await PRODUCTS(); // product()를 호출하여 데이터를 가져옵니다.

    console.log("products in server.ts : ", products);

    return {
        products: products.map((product) => ({
            id: product.id,
            nicName: product.user_name,
            name: product.title, // 상품 이름
            image: product.image, // 상품 이미지
            price: product.price, // 상품 가격
            rating: product.rating, // 평점 정보, 기본값 0
            seller: product.user_id, // 판매자 정보
            status: product.status_id
        }))
    };
};