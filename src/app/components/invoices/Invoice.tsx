import { Card, Button } from 'react-bootstrap';
import { InvoiceModel } from 'app/models/Invoice';
import { ShLink } from '../shared';

export default function Invoice(props: InvoiceModel) {
  return (
    <div className="invoice item">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Invoice {props.id}</Card.Title>
          <Card.Text>Customer: {props.customer.first_name} {props.customer.first_name}</Card.Text>
          <Card.Text>
            Paid: {props.paid ? 'Yes' : 'No'}
          </Card.Text>
          <Card.Text>Finalized: {props.finalized ? 'Yes' : 'No'}</Card.Text>
          <Button variant="primary"><ShLink href={`/invoice-details/${props.id}`}>View</ShLink></Button>
        </Card.Body>
      </Card>
    </div>
  )
}