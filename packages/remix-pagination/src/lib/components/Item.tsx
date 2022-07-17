import { FC } from 'react';

interface ItemProps {
  children: React.ReactNode;
  theme: { [key: string]: any };
  [key: string]: any;
}

export const Item: FC<ItemProps> = ({ children, theme }) => {
  return <li className={theme['next-pagination__item']}>{children}</li>;
};
