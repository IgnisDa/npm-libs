import { RemixPagination, styles } from '@ignisda/remix-pagination';

import indexPageStyles from '../styles/pages/index.css';

import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { route } from 'routes-gen';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: indexPageStyles },
];

const examples = [
  {
    name: 'With default styles',
    display: <RemixPagination total={100} size={7} />,
  },
  {
    name: 'With custom styles (using class prefix)',
    display: (
      <RemixPagination
        total={100}
        iconSize="16px"
        size={7}
        classPrefix="custom"
      />
    ),
  },
];

export default function Index() {
  return (
    <div className="min-h-screen p-8 lg:p-20 flex">
      <div className="w-full space-y-14">
        <h1 className="text-gray-800 font-serif text-4xl underline lg:text-5xl text-center">
          Remix Pagination Demo
        </h1>
        <div className="space-y-10">
          {examples.map((e, idx) => (
            <div key={idx} className="space-y-3">
              <p className="text-lg lg:text-2xl">{e.name}</p>
              {e.display}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-3xl">Example Page</h2>
          <Link to={route('/pokemon')}>Pokemon</Link>
        </div>
      </div>
    </div>
  );
}
