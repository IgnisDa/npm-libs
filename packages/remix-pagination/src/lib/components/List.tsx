import type { FC } from 'react';

interface ListProps {
  children: React.ReactNode;
  classPrefix: string;
}

export const List: FC<ListProps> = ({ children, classPrefix }) => {
  return <ul className={`${classPrefix}remix-pagination__list`}>{children}</ul>;
};
