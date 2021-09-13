import { ProductModel } from './Product';
import { PaginationModel } from './Pagination';
import { CustomerModel } from './Customer';

export interface CompleteInvoicesModel {
    invoices: InvoiceModel[],
    pagination: PaginationModel
}

export interface InvoiceModel {
    id: number;
    customer_id: number;
    finalized: boolean;
    paid: boolean;
    date: string;
    deadline: string;
    total: number;
    tax: string;
    customer: CustomerModel;
    invoice_lines_attributes: InvoiceLineModel[];
}

export interface InvoiceLineModel {
    id?: number;
    invoice_id: number;
    product_id: number;
    quantity: number;
    label: string;
    unit: string;
    vat_rate: string;
    price: string | number;
    tax: string;
    product: ProductModel;
}
