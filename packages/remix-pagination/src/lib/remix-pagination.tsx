import { useSearchParams } from '@remix-run/react';
import { FC } from 'react';
import {
  BsChevronRight as NextIcon,
  BsChevronLeft as PreviousIcon,
} from 'react-icons/bs';
import { withQuery } from 'ufo';

import { Item as ItemComponent } from './components/Item';
import { Link as LinkComponent } from './components/Link';
import { List as ListComponent } from './components/List';
import { getPageNumbers } from './utils/get-page-numbers';

export interface RemixPaginationProps {
  /**
   * The total number of items that this component encompasses
   */
  total: number;

  /**
   * The query component that indicates the current page, defaults to `page`
   */
  pageQuery?: string;

  /**
   * The query component that indicates the size of each page, defaults to `size`
   */
  sizeQuery?: string;

  /**
   * The number of items that are displayed on one page
   */
  size?: number;

  /**
   * A prefix that will be applied to all classes applied, can be used for custom styling.
   * For example, if value is `pag`, then `pag__remix-pagination__container` will be
   * applied to the outer container. This is useful for custom styling. Note: specifying
   * this option will immediately cause the default styles to break, you will have to take
   * care of styling yourself.
   */
  classPrefix?: string;

  /**
   * The size of icons. This is passed directly to the underlying `react-icon` component.
   * Defaults to `1.5em`.
   */
  iconSize?: string | number;
}

export const RemixPagination: FC<RemixPaginationProps> = ({
  total,
  pageQuery = 'page',
  sizeQuery = 'size',
  size = 20,
  classPrefix,
  iconSize = '1em',
}) => {
  const [params] = useSearchParams();

  const query = Object.fromEntries(params.entries());

  const currentPage = Number(query[pageQuery] || 1);
  const pageSize = Number(query[sizeQuery] || size);

  const isLastPage = currentPage * pageSize >= total;
  const pageNumbers = getPageNumbers({ currentPage, pageSize, total });

  const url = (page: string | number) =>
    withQuery('', {
      ...query,
      [pageQuery]: page.toString(),
      [sizeQuery]: size.toString(),
    });

  if (pageNumbers.length === 0) return null;

  const prefix = classPrefix ? `${classPrefix}__` : '';

  return (
    <nav
      className={`${prefix}remix-pagination__container`}
      aria-label="pagination"
    >
      <ListComponent classPrefix={prefix}>
        <ItemComponent classPrefix={prefix}>
          {currentPage !== 1 ? (
            <LinkComponent
              classPrefix={prefix}
              to={url(currentPage - 1)}
              label="Previous page"
              isIcon
            >
              <PreviousIcon
                size={iconSize}
                className={`${prefix}remix-pagination__icon`}
              />
            </LinkComponent>
          ) : (
            <LinkComponent
              classPrefix={prefix}
              to="#"
              label="No previous page available"
              isIcon
              disabled
            >
              <PreviousIcon
                size={iconSize}
                className={`${prefix}remix-pagination__icon`}
              />
            </LinkComponent>
          )}
        </ItemComponent>
        {pageNumbers.map((pageNumber, i) =>
          pageNumber === '...' ? (
            <ItemComponent
              key={`${pageNumber}${i}`}
              classPrefix={prefix}
              hellip
            >
              <LinkComponent
                to="#"
                classPrefix={prefix}
                disabled
                label="ellipsis"
              >
                &hellip;
              </LinkComponent>
            </ItemComponent>
          ) : (
            <ItemComponent key={pageNumber} classPrefix={prefix}>
              {pageNumber === currentPage ? (
                <LinkComponent
                  to="#"
                  classPrefix={prefix}
                  label={`Page ${pageNumber}, current page`}
                  disabled
                  current
                >
                  {pageNumber}
                </LinkComponent>
              ) : (
                <LinkComponent
                  to={url(pageNumber)}
                  classPrefix={prefix}
                  label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </LinkComponent>
              )}
            </ItemComponent>
          )
        )}
        <ItemComponent classPrefix={prefix}>
          {!isLastPage ? (
            <LinkComponent
              to={url(currentPage + 1)}
              classPrefix={prefix}
              label="Next page"
              isIcon
            >
              <NextIcon
                size={iconSize}
                className={`${prefix}remix-pagination__icon`}
              />
            </LinkComponent>
          ) : (
            <LinkComponent
              to="#"
              classPrefix={prefix}
              label="No next page available"
              isIcon
              disabled
            >
              <NextIcon
                size={iconSize}
                className={`${prefix}remix-pagination__icon`}
              />
            </LinkComponent>
          )}
        </ItemComponent>
      </ListComponent>
    </nav>
  );
};

export default RemixPagination;
