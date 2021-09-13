import { useState, useCallback } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { debounce } from 'lodash';

export default function ShSearch(props: { onSearchChange: Function }) {
    const [text, setText] = useState('');

    const handleChange = (event: any) => {
        event.preventDefault();
        setText(event.target.value);
        debouncedHandler(event.target.value);
    };

    const emit = (query: string) => {
        props.onSearchChange({ query });
    }

    const debouncedHandler = useCallback(debounce(event => emit(event), 200, {
        'leading': true,
        'trailing': true
      }), []);

    return (
        <div>
        <Form className="d-flex offset-sm-3 col-sm-12">
                <FormControl
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={text}
                    onChange={(e) => handleChange(e)}
                />
            </Form>
        </div>
    )
}
