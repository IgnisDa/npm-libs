import type { FC } from 'react';

interface ItemProps {
  children: React.ReactNode;
  prefix: string;
  hellip?: boolean;
}

/**
 * Each item display on the pagination uses this component as a wrapper
 */
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
