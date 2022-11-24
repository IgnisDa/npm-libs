import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import styles from './tailwind.css';

import type { MetaFunction, LinksFunction } from '@remix-run/node';
import { Footer } from './lib/components/Footer';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Pagination Demo',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script
          defer
          data-domain="remix-pagination.ignisda.tech"
          src="https://plausible.ignisda.tech/js/script.js"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <div className="flex flex-1 p-8 lg:p-20">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
}
