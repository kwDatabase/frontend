import { error } from '@sveltejs/kit';
import { PRODUCTS } from '../../../../lib/sampleData/products.ts';

export const load = ({ params }) => {
    const selectedProduct = PRODUCTS.find((product) => product.id === Number(params.id)); // Number로 변환
    console.log("parameter id: ", params.id);

    if (!selectedProduct) {
        console.log("selectedProduct: ", selectedProduct);
        throw error(404, 'Product not found');
    }
    console.log("selectedProduct: ", selectedProduct);
    return { product: selectedProduct }; // 반환할 때 'product'라는 이름으로 반환
};