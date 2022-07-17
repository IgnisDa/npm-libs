// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Link as RemixLink } from '@remix-run/react';
import clsx from 'clsx';
import { FC } from 'react';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  label: string;
  theme: { [key: string]: any };
  current?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export const Link: FC<LinkProps> = ({
  children,
  to,
  label,
  theme,
  current,
  disabled,
  ...restProps
}) => {
  return (
    <RemixLink
      to={to}
      className={clsx(theme['next-pagination__link'], {
        [`${theme['next-pagination__link--current']}`]: current,
        [`${theme['next-pagination__link--disabled']}`]: disabled,
      })}
      aria-label={label}
      aria-current={current}
      {...restProps}
    >
      {children}
    </RemixLink>
  );
};
