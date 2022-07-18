// FIXME: this should technically not be required
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Link as RemixLink } from '@remix-run/react';
import clsx from 'clsx';

import type { FC } from 'react';

interface LinkProps {
  children: React.ReactNode;
  to: string;
  label: string;
  prefix: string;
  current?: boolean;
  isIcon?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

export const Link: FC<LinkProps> = ({
  children,
  to,
  label,
  prefix,
  current,
  isIcon = false,
  disabled,
  ...restProps
}) => {
  return (
    <RemixLink
      to={to}
      className={clsx(
        !isIcon
          ? `${prefix}remix-pagination__link`
          : `${prefix}remix-pagination__icon-link`,
        current && `${prefix}remix-pagination__link--current`,
        disabled && `${prefix}remix-pagination__link--disabled`
      )}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
      aria-label={label}
      aria-current={current}
      aria-disabled={disabled}
      {...restProps}
    >
      {children}
    </RemixLink>
  );
};
