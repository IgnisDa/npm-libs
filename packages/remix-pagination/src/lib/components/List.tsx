import { FC } from 'react';

interface ListProps {
  children: React.ReactNode;
  theme: { [key: string]: any };
}

export const List: FC<ListProps> = ({ children, theme }) => {
  return <ul className={theme['next-pagination__list']}>{children}</ul>;
};
