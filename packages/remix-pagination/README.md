# Remix Pagination

> pagination component for [Remix](Remix)

## Table of contents

- [Remix Pagination](#remix-pagination)
  - [Table of contents](#table-of-contents)
  - [Why use this pagination module?](#why-use-this-pagination-module)
  - [Install](#install)
  - [Usage](#usage)
  - [Theming](#theming)
  - [Contribute](#contribute)
    - [Setup](#setup)
  - [Development](#development)
  - [Publishing](#publishing)
  - [License](#license)

## Why use this pagination module?

- **Accessible.** Semantic HTML and fully marked up with appropriate aria roles for
  assisted browsing.
- **Usable.** The base CSS styles account for keyboard focus states and fat finger touch targets.
- **Responsive.** Works on all devices.
- **Theme-able.** Make it look however you want via custom classes.
- **Self contained.** There's only two required prop to get going. The rest of the logic is
  handled for you.
- **Works with Remix.** Integrated with the Remix router.

## Install

```bash
npm install --save @ignisda/remix-pagination
```

## Usage

This component is fairly self contained. You will need to pass the **total number of
potential results** and the **number of results in each page** in order to calculate the
number of pages to show.

```jsx
import { RemixPagination } from '@ignisda/remix-pagination';

export default function () {
  return (
    <div>
      <RemixPagination total={100} size={20} />;
    </div>
  );
}
```

You will need to import the CSS, either in your `_app.js`, or in your Sass build.

```jsx
import '@ignisda/remix-pagination/index.css';
```

When used, the pagination component will reload the same route with added pagination query params.

- `page` for the page number the user is on.
- `size` for the number of results per page.

e.g. ?page=4&size=20

The **default page** is 1.

You'll need to load the actual data from your API yourself.

## Theming

All components have the class `remix-pagination__$component` applied to them. This can be
changed via the `classPrefix` prop. You can see an example
[here](apps/remix-pagination-demo/app/routes/index.tsx).

## Contribute

This package was created with [NX](nx). You will need it installed to run this
project.

### Setup

To get set up you'll need to run `pnpm install`

## Development

In the root folder, run `npx nx serve remix-pagination-demo`. Then head over to
`http://localhost:3000` to see the example running.

Note: You will have to restart the dev server every time you make any changes to
`packages/remix-pagination` because Remix does not watch for files outside it's project. I
have not yet figured out how to fix this.

## Publishing

This project is automatically published using a combination of [NX](nx), [Conventional
Commits](conventional commits) and [Github Actions](.github/workflows/publish.yml).

## License

MIT © [IgnisDa](https://github.com/ignisda)

[remix]: https://remix.run/
[nx]: https://nx.dev/
[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/
