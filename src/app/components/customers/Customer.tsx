import { Card } from 'react-bootstrap';
import { CustomerModel } from 'app/models/Customer';
import { ShLink } from '../shared';

export default function Customers(props: CustomerModel) {
  return (
    <div className="customer item">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <ShLink href={`/invoices?customerId=${props.id}`}>{props.first_name} {props.last_name}</ShLink>
        </Card.Body>
      </Card>
    </div>
  )
}