import { useEffect, useState } from 'react';
import customersApi from '../../api/CustomersApi';
import Customer from './Customer';
import { CompleteCustomersModel, CustomerModel } from '../../models/Customer';
import { PaginationModel } from '../../models/Pagination';
import { ShSearch, ShPagination } from '../shared';
import { Service } from 'app/models/Service';

export default function Customers() {
  const [customers, setCustomers] = useState<Service<CustomerModel[]>>({ status: 'loading' });
  const [pagination, setPagination] = useState<Service<PaginationModel>>({ status: 'loading' });
  const [search, setSearch] = useState<string>('');

  const fetchCustomersByQuery = async ({ query, page = 1 }: { query: string; page: number; }) => {
    if (query || query === '') setSearch(query);
    const res: CompleteCustomersModel = await customersApi.fetchWithPagination({ query: query || search, page });
    setCustomers({ status: 'loaded', payload: res.customers });
    setPagination({ status: 'loaded', payload: res.pagination });
  }
  useEffect(() => {
    async function fetchData() {
        fetchCustomersByQuery({ query: '', page: 1 });
    };
    fetchData();
  }, []);

  return (
    <div className="customers container mb-4">
      <div className="customersList list">
        <div className="search col-sm-12 mb-5">
          Search a Customer
          <ShSearch {...{onSearchChange: fetchCustomersByQuery}} />
        </div>
        {customers.status === 'loaded' && customers.payload.map((customer: CustomerModel, index) => {
            return <Customer key={customer.id} { ...customer } />
        })}
      </div>
      {pagination.status === 'loaded' && 
        <ShPagination {...{pagination: pagination.payload}} {...{fetchByPage: fetchCustomersByQuery}} />}
    </div>
  )
}