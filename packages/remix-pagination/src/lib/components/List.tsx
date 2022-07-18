import type { FC } from 'react';

interface ListProps {
  children: React.ReactNode;
  prefix: string;
}

export const List: FC<ListProps> = ({ children, prefix }) => {
  return <ul className={`${prefix}remix-pagination__list`}>{children}</ul>;
};
