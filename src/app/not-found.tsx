import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h2>Oooops!</h2>
      <h2>This page is not found</h2>
      <Link href="/">Home</Link>
    </main>
  );
}
