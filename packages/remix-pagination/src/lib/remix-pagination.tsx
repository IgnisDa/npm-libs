import { useSearchParams } from '@remix-run/react';
import {
  BsChevronLeft as PreviousIcon,
  BsChevronRight as NextIcon,
} from 'react-icons/bs';
import { withQuery } from 'ufo';

import { Item as ItemComponent } from './components/Item';
import { Link as LinkComponent } from './components/Link';
import { List as ListComponent } from './components/List';
import { getPageNumbers } from './utils/get-page-numbers';

import type { FC } from 'react';

export interface RemixPaginationProps {
  /**
   * The total number of items that this component encompasses
   */
  total: number;

  /**
   * The number of items that are displayed on one page
   */
  size: number;

  /**
   * The query component that indicates the current page, defaults to `page`
   */
  pageQuery?: string;

  /**
   * A prefix that will be applied to all classes applied, can be used for custom styling.
   * For example, if value is `pag`, then `pag__remix-pagination__container` will be
   * applied to the outer container (and so on). This is useful for custom styling. Note:
   * specifying this option will cause the default styles to break; you will have to take
   * care of styling yourself.
   */
  classPrefix?: string;

  /**
   * The size of icons. This is passed directly to the underlying `react-icon` component.
   * Defaults to `1em`.
   */
  iconSize?: string | number;

  /**
   * The text to use for ellipses. Defaults to `...`
   */
  ellipsesText?: string;
}

export const RemixPagination: FC<RemixPaginationProps> = ({
  total,
  pageQuery = 'page',
  size,
  classPrefix,
  iconSize = '1em',
  ellipsesText,
}) => {
  const [params] = useSearchParams();

  const query = Object.fromEntries(params.entries());

  const currentPage = Number(query[pageQuery] || 1);

  const isLastPage = currentPage * size >= total;
  const pageNumbers = getPageNumbers({
    currentPage,
    pageSize: size,
    total,
    ellipsesText,
  });

  const url = (page: string | number) =>
    withQuery('', { ...query, [pageQuery]: page.toString() });

  if (pageNumbers.length === 0) return null;

  const prefix = classPrefix ? `${classPrefix}__` : '';

  return (
    <nav
      className={`${prefix}remix-pagination__container`}
      aria-label="pagination"
    >
      <ListComponent prefix={prefix}>
        <ItemComponent prefix={prefix}>
          {currentPage !== 1 ? (
            <LinkComponent
              prefix={prefix}
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
              prefix={prefix}
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
            <ItemComponent key={`${pageNumber}${i}`} prefix={prefix} hellip>
              <LinkComponent to="#" prefix={prefix} disabled label="ellipsis">
                &hellip;
              </LinkComponent>
            </ItemComponent>
          ) : (
            <ItemComponent key={pageNumber} prefix={prefix}>
              {pageNumber === currentPage ? (
                <LinkComponent
                  to="#"
                  prefix={prefix}
                  label={`Page ${pageNumber}, current page`}
                  disabled
                  current
                >
                  {pageNumber}
                </LinkComponent>
              ) : (
                <LinkComponent
                  to={url(pageNumber)}
                  prefix={prefix}
                  label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </LinkComponent>
              )}
            </ItemComponent>
          )
        )}
        <ItemComponent prefix={prefix}>
          {!isLastPage ? (
            <LinkComponent
              to={url(currentPage + 1)}
              prefix={prefix}
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
              prefix={prefix}
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
