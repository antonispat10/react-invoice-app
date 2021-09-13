import { useEffect, useState } from 'react';
import invoicesApi from '../../api/InvoicesApi';
import Invoice from './Invoice';
import { CompleteInvoicesModel, InvoiceModel } from '../../models/Invoice';
import { ShLink, ShPagination } from '../shared';
import { PaginationModel } from '../../models/Pagination';
import { Service } from 'app/models/Service';
import { Button, Form } from 'react-bootstrap';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Service<InvoiceModel[]>>({ status: 'loading' });
  const [pagination, setPagination] = useState<Service<PaginationModel>>({ status: 'loading' });
  const [finalized, setFinalized] = useState<boolean>(false);
  const [nonFinalized, setNonFinalized] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<any>(null);

  useEffect(() => {
    setCustomerId(new URLSearchParams(window.location.search).get('customerId'));
    async function fetchData() {
      let filter = ''
      if (customerId) {
        filter = JSON.stringify({ field: 'customer_id', operator: 'eq', value: customerId });
      }
      fetchInvoicesByPage({ page: 1, filter });
    };
    fetchData();
  }, [customerId]);

  const fetchInvoicesByPage = async ({ page = 1, filter = '' }: { page?: number; filter?: string }) => {
    const res: CompleteInvoicesModel = await invoicesApi.fetchWithPagination({ page, filter });
    setInvoices({ status: 'loaded', payload: res.invoices });
    setPagination({ status: 'loaded', payload: res.pagination });
  }

  const handleFinalizedFilter = async (value: boolean, type: string) => {
    if (type === 'finalized') setFinalized(value);
    else setNonFinalized(value);
    let filter = '';
    if (value) filter = JSON.stringify({ field: 'finalized', operator: 'eq', value: type === 'finalized' ? true : false });
    await fetchInvoicesByPage({ page: 1, filter  });
  }

  return (
    <div className="invoices container">
      <div className="invoicesList list">
        <div className="col-sm-12 mb-4">
          <Button variant="primary"><ShLink href={`/new-invoice`}>Create New Invoice</ShLink></Button>
        </div>
        {!customerId && <div className="col-sm-12 filters mb-5">
          <h5>Filters</h5>
          <div className="d-flex">
            <div className="mr-5">
              <div>Finalized</div>
              <Form.Check
                checked={finalized}
                onChange={(e: any) => handleFinalizedFilter(e.target.checked, 'finalized')} />
            </div>
            <div className="mr-5">
              <div>Non Finalized</div>
              <Form.Check
                checked={nonFinalized}
                onChange={(e: any) => handleFinalizedFilter(e.target.checked, 'non-finalized')} />
            </div>
          </div>
        </div>}
        {invoices.status === 'loaded' && invoices.payload.map((invoice: InvoiceModel, index: number) => {
            return <Invoice key={invoice.id} {...invoice} />
        })}
      </div>
      {pagination.status === 'loaded' && pagination.payload && 
        <ShPagination {...{pagination: pagination.payload}} {...{fetchByPage: fetchInvoicesByPage}} />}
    </div>
  )
}