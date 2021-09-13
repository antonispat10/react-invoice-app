import { FormControl } from 'react-bootstrap';
import { ShLink } from '../shared';
import customersApi from '../../api/CustomersApi';
import { useCallback, useState } from 'react';
import { CompleteCustomersModel, CustomerModel } from 'app/models/Customer';
import { Service } from 'app/models/Service';
import { debounce } from 'lodash';
import invoicesApi from '../../api/InvoicesApi';
import { InvoiceModel } from 'app/models/Invoice';

export default function NewInvoice() {
  const [search, setSearch] = useState<string>('');
  const [customers, setCustomers] = useState<Service<CustomerModel[]>>({ status: 'loading' })
  const [invoiceId, setInvoiceId] = useState<number | null>(null);

  const updateSearch = (query: string) => {
    setSearch(query);
    debouncedHandler(query);
  };

  const fetchCustomers = async (query: string) => {
    if (!query) return setCustomers({ status: 'loading' });
    const res: CompleteCustomersModel = await customersApi.fetchWithPagination({ query , page: 1 })
    setCustomers({ status: 'loaded', payload: res.customers });
  };

  const debouncedHandler = useCallback(debounce(event => fetchCustomers(event), 300, {
    'leading': true,
    'trailing': true
  }), []);

  const createNewInvoice = async (customerId: number) => {
    const res: InvoiceModel = await invoicesApi.create(customerId);
    setInvoiceId(res.id)
  }

  return (
    <div className="new-invoice">
      <h3>Create New Invoice</h3>
      <h3 className="mt-5 mb-5">Please search a customer</h3>
      <FormControl
        type="search"
        placeholder="Search"
        value={search}
        onChange={(e: any) => updateSearch(e.target.value)}
        />
      {customers.status === 'loaded' && 
        <div className="results">
          {customers.payload.map((customer, i) => {
            return  <div key={customer.id} className="result" onClick={async () => await createNewInvoice(customer.id)}>
              <div>{customer.first_name} {customer.last_name}</div>
              {invoiceId && <ShLink {...{ autotrigger: true }} href={`/invoice-details/${invoiceId}`}></ShLink>}
            </div>
          })}
        </div>
      }
    </div>
  )
}