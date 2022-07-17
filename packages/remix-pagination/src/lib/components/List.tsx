import { FC } from 'react';

interface ListProps {
  children: React.ReactNode;
}

export const List: FC<ListProps> = ({ children }) => {
  return <ul className={'next-pagination__list'}>{children}</ul>;
};
