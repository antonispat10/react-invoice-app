import { PaginationModel } from './Pagination';

export interface CompleteCustomersModel {
    customers: CustomerModel[],
    pagination: PaginationModel
}

export interface CustomerModel {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
    zip_code: string;
    city: string;
    country: string;
    country_code: string;
}
