import { PaginationModel } from './Pagination';

export interface CompleteProductModel {
    products: ProductModel[],
    pagination: PaginationModel
}

export interface ProductModel {
    id: number;
    label: string;
    vat_rate: string;
    unit: string;
    unit_price: string;
    unit_price_without_tax: string;
    unit_tax: string;
}