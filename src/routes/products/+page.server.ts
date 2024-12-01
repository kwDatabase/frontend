import { PRODUCTS } from '../../lib/sampleData/products.js';

export const load = () => {
	return {
		products: PRODUCTS.map((product) => ({
			id: product.id,
			name: product.name,
			image: product.image,
            discount: product.discount,
            popularity: product.popularity,
            price: product.price,
            rating: product.rating,
            recentDate: product.recentDate,
            seller: product.seller,
            stock: product.stock
		}))
	};
};