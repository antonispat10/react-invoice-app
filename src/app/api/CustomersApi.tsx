import axios from './axios';
import { CompleteCustomersModel } from 'app/models/Customer';

export class CustomersApi<T> {
    get baseUrl () {
        return 'customers';
    }

    fetchWithPagination ({ query, page }: { query: string; page: number }): Promise<CompleteCustomersModel> {
        return axios.get(`${this.baseUrl}/search`, { params: { query, page } }).then(({ data } ) => data);
    }
}

export default new CustomersApi();