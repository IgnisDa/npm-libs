import { FC } from 'react';

interface ItemProps {
  children: React.ReactNode;
  [key: string]: any;
}

export const Item: FC<ItemProps> = ({ children }) => {
  return <li className="next-pagination__item">{children}</li>;
};
