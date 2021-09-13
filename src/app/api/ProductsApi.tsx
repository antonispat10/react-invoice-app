import axios from './axios';
import { CompleteProductModel } from 'app/models/Product';

export class ProductsApi<T> {
    get baseUrl () {
        return 'products';
    }

    fetch ({ query }: { query: string; }): Promise<CompleteProductModel> {
        return axios.get(`${this.baseUrl}/search`, { params: { query } }).then(({ data } ) => data);
    }
}

export default new ProductsApi();