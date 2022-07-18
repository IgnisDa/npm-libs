import { FC } from 'react';

interface ItemProps {
  children: React.ReactNode;
  hellip?: boolean;
  classPrefix: string;
}

export const Item: FC<ItemProps> = ({
  children,
  hellip = false,
  classPrefix,
}) => {
  return (
    <li
      className={`${classPrefix}remix-pagination__item`}
      data-hellip={String(hellip)}
    >
      {children}
    </li>
  );
};
