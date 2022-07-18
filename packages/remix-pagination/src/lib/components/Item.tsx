import type { FC } from 'react';

interface ItemProps {
  children: React.ReactNode;
  prefix: string;
  hellip?: boolean;
}

export const Item: FC<ItemProps> = ({ children, hellip = false, prefix }) => {
  return (
    <li
      className={`${prefix}remix-pagination__item`}
      data-hellip={hellip ? 'yes' : 'no'}
    >
      {children}
    </li>
  );
};
