import { CompleteInvoicesModel, InvoiceModel } from 'app/models/Invoice';
import axios from './axios';
import { pick, omit } from 'lodash';

export class InvoicesApi {
    get baseUrl () {
        return 'invoices';
    }

    fetchWithPagination ({ page = 1, filter }: { page: number; filter?: string }): Promise<CompleteInvoicesModel> {
        return axios.get(`${this.baseUrl}?page=${page}&filter=${filter}`).then(({ data }) => data);
    }

    get (id: number): Promise<InvoiceModel> {
        return axios.get(`${this.baseUrl}/${id}`).then(({ data }) => {
            data = {
                ...data,
                invoice_lines_attributes: data.invoice_lines
            };
            delete data.invoice_lines;
            return data;
        });
    }

    create (customerId: number): Promise<InvoiceModel> {
        const invoice = {
            customer_id: customerId,
            finalized: false,
            paid: false,
            date: new Date().toISOString().split('T')[0],
            invoice_lines_attributes: []
        };
        return axios.post(`${this.baseUrl}`, { invoice }).then(({ data }) => data);
    }

    update (data: InvoiceModel): Promise<InvoiceModel> {
        const invoiceLinesReqObject = data.invoice_lines_attributes.map(v => omit(v, 'invoice_id', 'product'));
        const objectToSend = { ...pick(data, ['customer_id', 'finalized', 'paid', 'deadline', 'date', '_destroy']), invoice_lines_attributes: invoiceLinesReqObject };
        return axios.put(`${this.baseUrl}/${data.id}`, { invoice: objectToSend }).then(({ data }) => {
            data = {
                ...data,
                invoice_lines_attributes: data.invoice_lines
            }
            delete data.invoice_lines;
            return data;
        })
    }

    delete (id: number): Promise<InvoiceModel> {
        return axios.delete(`${this.baseUrl}/${id}`).then(({ data }) => data);
    }
}

export default new InvoicesApi();