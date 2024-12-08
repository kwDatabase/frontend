const API_URL = 'http://localhost:3000/products'; // API URL 설정

export async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('네트워크 응답이 좋지 않습니다.');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('상품 데이터를 가져오는 중 오류 발생:', error);
        return [];
    }
}

// fetchProducts 함수를 PRODUCTS라는 이름으로 export
export const PRODUCTS = fetchProducts;