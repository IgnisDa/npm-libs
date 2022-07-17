import { useSearchParams } from '@remix-run/react';
import { FC } from 'react';
import { GrNext as NextIcon, GrPrevious as PreviousIcon } from 'react-icons/gr';
import { withQuery } from 'ufo';

import { Item as ItemComponent } from './components/Item';
import { Link as LinkComponent } from './components/Link';
import { List as ListComponent } from './components/List';
import defaultTheme from './index.module.scss';
import { getPageNumbers } from './utils/get-page-numbers';
import { getSizes } from './utils/sizes';

export interface RemixPaginationProps {
  /**
   * The total number of pages
   */
  total: number;

  /**
   * A CSS modules style object
   */
  theme?: { [key: string]: any };

  /**
   * An array of page size numbers
   */
  sizes?: number[];

  /**
   * Label for the page size dropdown
   */
  perPageText?: string;

  /**
   * Label for the invisible page size button
   */
  setPageSizeText?: string;

  /**
   * Extra props to pass to the Remix links
   */
  linkProps?: { [key: string]: any };
}

export const RemixPagination: FC<RemixPaginationProps> = ({
  total,
  theme,
  sizes,
  perPageText,
  setPageSizeText,
  linkProps,
}) => {
  const styles = theme || defaultTheme;

  const [params] = useSearchParams();

  const query = Object.fromEntries(params.entries());

  const currentPage = Number(query['page'] || 1);
  // default|custom => evaluated sizes
  const cSizes = getSizes(sizes);
  const pageSize = Number(query['size'] || cSizes[0]);

  const isLastPage = currentPage * pageSize >= total;
  const pageNumbers = getPageNumbers({ currentPage, pageSize, total });

  const url = (page: string | number) =>
    withQuery('', { ...query, page: page.toString() });

  return (
    <nav className={styles['next-pagination']} aria-label="pagination">
      {/* TODO: Export helper functions instead */}
      {/* <Head>
        {currentPage !== 1 ? (
          <link rel="prev" href={url(currentPage - 1)} />
        ) : null}
        {!isLastPage ? <link rel="next" href={url(currentPage + 1)} /> : null}
      </Head> */}
      <ListComponent theme={styles}>
        <ItemComponent theme={styles}>
          {currentPage !== 1 ? (
            <LinkComponent
              to={url(currentPage - 1)}
              {...linkProps}
              label="Previous page"
              theme={styles}
            >
              <PreviousIcon size={24} />
            </LinkComponent>
          ) : (
            <LinkComponent
              to="#"
              label="No previous page available"
              disabled
              theme={styles}
            >
              <PreviousIcon size={24} />
            </LinkComponent>
          )}
        </ItemComponent>
        {pageNumbers.map((pageNumber, i) =>
          pageNumber === '...' ? (
            <ItemComponent key={`${pageNumber}${i}`} hellip theme={styles}>
              <LinkComponent to="#" disabled label="ellipsis" theme={styles}>
                &hellip;
              </LinkComponent>
            </ItemComponent>
          ) : (
            <ItemComponent key={pageNumber} theme={styles}>
              {pageNumber === currentPage ? (
                <LinkComponent
                  to="#"
                  label={`Page ${pageNumber}, current page`}
                  disabled
                  current
                  theme={styles}
                >
                  {pageNumber}
                </LinkComponent>
              ) : (
                <LinkComponent
                  to={url(pageNumber)}
                  label={`Page ${pageNumber}`}
                  theme={styles}
                >
                  {pageNumber}
                </LinkComponent>
              )}
            </ItemComponent>
          )
        )}
        <ItemComponent theme={styles}>
          {!isLastPage ? (
            <LinkComponent
              to={url(currentPage + 1)}
              label="Next page"
              theme={styles}
            >
              <NextIcon size={24} />
            </LinkComponent>
          ) : (
            <LinkComponent
              to="#"
              label="No next page available"
              disabled
              theme={styles}
            >
              <NextIcon size={24} />
            </LinkComponent>
          )}
        </ItemComponent>
      </ListComponent>
    </nav>
  );
};

export default RemixPagination;
