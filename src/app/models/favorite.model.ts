import { ProductDTO } from '../services/product';

export interface Favorite {
    productId: number;
    productName: string;
    productDetails?: ProductDTO;
}
