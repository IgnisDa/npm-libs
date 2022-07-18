import type { FC } from 'react';

interface ListProps {
  children: React.ReactNode;
  prefix: string;
}

/**
 * This component is used to display a list of unordered elements
 */
export const List: FC<ListProps> = ({ children, prefix }) => {
  return <ul className={`${prefix}remix-pagination__list`}>{children}</ul>;
};
