import { RemixPagination } from '@ignisda/remix-pagination';

export default function Index() {
  return (
    <div>
      <div>Hello world!</div>
      <RemixPagination total={100} />
    </div>
  );
}
