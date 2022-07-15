import { render } from '@testing-library/react';

import RemixPagination from './remix-pagination';

describe('RemixPagination', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RemixPagination />);
    expect(baseElement).toBeTruthy();
  });
});
