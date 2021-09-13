import { Pagination } from 'react-bootstrap';
import { PaginationModel } from '../../models/Pagination';

export default function ShPagination(props: { pagination: PaginationModel; fetchByPage: Function }) {

    let active = 2;
    let items = [];
    for (let number = 1; number <= props.pagination.total_pages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === props.pagination.page} onClick={() => props.fetchByPage({ page: number })}>
          {number}
        </Pagination.Item>,
      );
    }

  return (
    <div className="pagination mt-4">
        <Pagination>{items}</Pagination>
    </div>
  )
}
