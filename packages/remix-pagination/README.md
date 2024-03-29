# Remix Pagination

Pagination component for [Remix](Remix) apps.

## Table of contents

- [Remix Pagination](#remix-pagination)
  - [Table of contents](#table-of-contents)
  - [Why use this pagination module?](#why-use-this-pagination-module)
  - [Installing](#installing)
  - [Example](#example)
  - [Usage](#usage)
  - [Theming](#theming)
  - [Component Props](#component-props)
  - [Contributing](#contributing)
    - [Setup](#setup)
    - [Development](#development)
    - [Publishing](#publishing)
  - [Acknowledgements](#acknowledgements)
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

## Installing

```bash
# the install command of your favorite package manager
pnpm install @ignisda/remix-pagination
```

## Example

You can view the live example on [this](https://remix-pagination.diptesh.me) link.

The source code of the above website is here:
[remix-pagination-demo](../../apps/remix-pagination-demo). This app contains an example
using the [Pokemon](https://graphql-pokeapi.graphcdn.app/) Graphql API.

You can run it locally by following the steps described in [development](#development).

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

The default component is un-styled. You can use default styles by importing the CSS like
you would in any Remix app as explained
[here](https://remix.run/docs/en/v1/guides/styling).

```tsx
import { styles as remixPaginationStyles } from '@ignisda/remix-pagination';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: remixPaginationStyles },
];
```

When used, the pagination component will reload the same route with added pagination query
parameters.

- `page` for the page number the user is on.

The **default page** is 1.

## Theming

All components have the class `remix-pagination__$component` applied to them. This can be
changed via the `classPrefix` prop. You can see an example
[here](https://github.com/IgnisDa/npm-libs/blob/fb1c93bc78325c059b1fc667bccfc3f520a39474/apps/remix-pagination-demo/app/styles/pages/index.scss).

## Component Props

The component accepts many props and you can see their documentation in the component
[source](./src/lib/remix-pagination.tsx).

## Contributing

This package was created with [NX](nx). You will need it installed to run this project.

### Setup

To get set up you'll need to run `pnpm install`.

### Development

In the root folder, run `npx nx serve remix-pagination-demo`. Then head over to
`http://localhost:3000` to see the example running.

Note: You will have to restart the development server every time you make any changes to
`packages/remix-pagination` because Remix does not watch for files outside it's project. I
have not yet figured out how to fix this.

### Publishing

This project is automatically published using a combination of [NX](nx), [Conventional
Commits](conventional-commits) and [Github
Actions](https://github.com/IgnisDa/npm-libs/blob/39e95b2b74331b2e90e6edf419ec91c0e302f379/.github/workflows/publish.yml).

## Acknowledgements

A lot of the code has been inspired from
[@etchteam/next-pagination](https://github.com/etchteam/next-pagination).

## License

MIT © [IgnisDa](https://github.com/ignisda)

[remix]: https://remix.run/
[nx]: https://nx.dev/
[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/
