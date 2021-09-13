import { useCallback, useEffect, useState } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { InvoiceLineModel, InvoiceModel } from 'app/models/Invoice';
import { Service } from 'app/models/Service';
import invoicesApi from '../../api/InvoicesApi';
import { CompleteProductModel, ProductModel } from 'app/models/Product';
import productsApi from 'app/api/ProductsApi';
import { debounce } from 'lodash';
import { ShLink } from '../shared';

export default function InvoiceDetails() {
  const [invoice, setInvoice] = useState<Service<InvoiceModel>>({ status: 'loading' });
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const [invoiceNotExisting, setInvoiceNotExisting] = useState<boolean>(false);

  useEffect(() => {
    async function fetchInvoice() {
      const id = +window.location.pathname.split('/').reverse()[0];
      if (!id) setInvoiceNotExisting(true);
      const data: InvoiceModel = await invoicesApi.get(id);
      setInvoice({ status: 'loaded', payload: data });
    };
  fetchInvoice();
  }, []);

  const updateSearch = (query: string) => {
    setSearch(query);
    debouncedHandler(query);
  };

  const fetchProducts = async (query: string) => {
    if (invoice.status !== 'loaded') return ;
    if (!query) return setSearchResults([]);
    const res: CompleteProductModel = await productsApi.fetch({ query });
    const invoiceProducts = invoice.payload.invoice_lines_attributes.map(v => v.product_id);
    // show only products that are not inside the invoice
    const products = res.products.filter(p => {
      return !invoiceProducts.includes(p.id);
    })
    setSearchResults(products);
  };
  // eslint-disable-next-line
  const debouncedHandler = useCallback(debounce(event => fetchProducts(event), 300, {
    'leading': true,
    'trailing': true
  }), [invoice]);

  const handleQuantityChange = (event: any, product_id: number | undefined, index: number) => {
    if (invoice.status !== 'loaded') return ;
    let { value, name } = event.target;
    /* @ts-ignore */
    const prevPrice = +invoice.payload.invoice_lines_attributes[index].price * invoice.payload.invoice_lines_attributes[index].quantity;
    event.preventDefault();
    const invoiceLineAttributes = invoice.payload.invoice_lines_attributes.map((v, i) => {
      if (v.product_id === product_id) {
        return {
          ...v,
          [name]: value
        }
      }
      return v;
    })
    const newPrice = +invoice.payload.invoice_lines_attributes[index].price * value

    setInvoice((current: any) => ({
      ...current, 
      payload: {
        ...current.payload,
        invoice_lines_attributes: [
          ...invoiceLineAttributes
        ],
        total: +current.payload.total + (newPrice - prevPrice)
      }
    }));
  }

  const addProduct = async (product: ProductModel) => {
    if (invoice.status !== 'loaded') return ;
    invoice.payload.invoice_lines_attributes.push(
      {
        product_id: product.id,
        quantity: 1,
        label: product.label,
        unit: product.unit,
        vat_rate: product.vat_rate,
        price: product.unit_price,
        tax: product.unit_tax,
        invoice_id: invoice.payload.id,
        product
      });
    const res = await updateBackend();

    // adding the newly created id to the invoice line product
    const invoice_lines_attributes: InvoiceLineModel[] = invoice.payload.invoice_lines_attributes.map((v, i) => {
      if (i === invoice.payload.invoice_lines_attributes.length - 1) {
        return {
          ...v,
          id: res?.invoice_lines_attributes[invoice.payload.invoice_lines_attributes.length-1].id
        }
      }
      return v;
    })

    setInvoice((current: any) => ({
      ...current,
      payload: {
        ...current.payload,
        invoice_lines_attributes
      }
    }))
    updateSearch(search);
  }

  const handleInvoiceChange = async (event: any) => {
    if (invoice.status !== 'loaded') return ;
    let { value, name, type } = event.target;
    event.preventDefault();
    const updatePath = name.split(".");
    if (type === 'checkbox') {
      value = event.target.checked;
    }
    if (updatePath.length === 1) {
      const [key] = updatePath;
      setInvoice((current: any) => ({
        ...current,
        payload: {
          ...current.payload,
          [key]: value
        }
      }))
    }
    updateBackend();
  };

  const deleteInvoice = async (id: number) => {
    await invoicesApi.delete(id);
    setInvoiceNotExisting(true);
  };

  const updateBackend = () => {
    if (invoice.status === 'loaded') {
      // eslint-disable-next-line
      const emptyQuantityIndex = invoice.payload.invoice_lines_attributes.findIndex((v: InvoiceLineModel) => !v.quantity || v.quantity == 0);
      if (emptyQuantityIndex !== -1) {
        const invoice_lines_attributes = invoice.payload.invoice_lines_attributes.map((v, index) => {
          if (emptyQuantityIndex === index) return { ...v, quantity: 1}
          return v;
        });
        setInvoice((current: any) => ({
          ...current,
          payload: {
            ...current.payload,
            invoice_lines_attributes
          }
        }))
      }
      return invoicesApi.update(invoice.payload);
    }
  };

  return (
    <div className="invoice">
      {invoiceNotExisting && <ShLink {...{ autotrigger: true }} href="/invoices"></ShLink>}
      {invoice.status === 'loaded' &&
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <h2 className="mb-3">Invoice {invoice.payload.id}</h2>
            {invoice.payload.finalized && <div className="text-danger mb-2">*You cannot edit a finalized invoice</div>}
            <h5>{invoice.payload.customer.first_name} {invoice.payload.customer.last_name}</h5>
            <div>{invoice.payload.date}</div>
            <div className="d-flex">
              <Form.Label className="mr-3">Paid</Form.Label>
              <Form.Check
                name="paid"
                key={invoice.payload.paid.toString()}
                checked={invoice.payload.paid}
                disabled={invoice.payload.finalized}
                onChange={e => handleInvoiceChange(e)} />
            </div>
            <div className="d-flex">
              <Form.Label className="mr-3">Finalized</Form.Label>
              <Form.Check
                name="finalized"
                key={invoice.payload.finalized.toString()}
                checked={invoice.payload.finalized}
                disabled={invoice.payload.finalized}
                onChange={e => handleInvoiceChange(e)} />
            </div>
            <h5>Total price: {invoice.payload.total}</h5>
            <div className="mb-3">
              <Button variant="danger" onClick={() => deleteInvoice(invoice.payload.id)} disabled={invoice.payload.finalized}>Delete Invoice</Button>
            </div>
            <h6>Add new product</h6>
            <FormControl
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  disabled={invoice.payload.finalized}
                  onChange={(e: any) => updateSearch(e.target.value)}
              />
            <div className="results">
              {searchResults.map((product, i) => {
                return <div key={product.id} className="result" onClick={() => addProduct(product)}>
                  {product.label} Price: {product.unit_price}
                </div>
              })}
            </div>
            <h5 className="mt-5">Products</h5>
            <div className="invoice-lines list">
              {invoice.payload.invoice_lines_attributes.map((line, index) => {
                return <div key={line.product_id} className="mb-4 invoice-line item">
                  <div className="left">
                    <h5>{line.label} Price: {line.product.unit_price}</h5>
                    <div className="d-flex mb-4 mt-4">
                      <Form.Text className="mr-3">Quantity: </Form.Text>
                      <Form.Control
                        type="number"
                        name="quantity"
                        min="1"
                        disabled={invoice.payload.finalized}
                        value={line.quantity}
                        onChange={e => handleQuantityChange(e, line.product_id, index)}
                        onBlur={(e: any) => updateBackend()} />
                    </div>
                  </div>
                </div>
              })}
            </div>
          </Form.Group>
        </Form>
      }
    </div>
  )
}
