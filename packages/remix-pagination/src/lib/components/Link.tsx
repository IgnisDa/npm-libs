// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Link as RemixLink } from '@remix-run/react';
import clsx from 'clsx';
import { FC } from 'react';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  label: string;
  current?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export const Link: FC<LinkProps> = ({
  children,
  to,
  label,
  current,
  disabled,
  ...restProps
}) => {
  return (
    <RemixLink
      to={to}
      className={clsx(
        'next-pagination__link',
        current && 'next-pagination__link--current',
        disabled && 'next-pagination__link--disabled'
      )}
      aria-label={label}
      aria-current={current}
      {...restProps}
    >
      {children}
    </RemixLink>
  );
};
