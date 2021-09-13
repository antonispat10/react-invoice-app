import './App.css';
import Header from './components/Header';
import Invoices from './components/invoices/Invoices';
import NewInvoice from './components/invoices/NewInvoice';
import InvoiceDetails from './components/invoices/InvoiceDetails';
import Customers from './components/customers/Customers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ShRoute } from './components/shared';

function App() {
  return (
    <div className="App">
      <Header />
      <ShRoute path="/">
        <Invoices />
      </ShRoute>
      <ShRoute path="/invoices">
        <Invoices />
      </ShRoute>
      <ShRoute path="/customers">
        <Customers />
      </ShRoute>
      <ShRoute path="/new-invoice">
        <NewInvoice />
      </ShRoute>
      <ShRoute path="/invoice-details/:id">
        {/* @ts-ignore */}
        <InvoiceDetails />
      </ShRoute>
    </div>
  );
}

export default App;
