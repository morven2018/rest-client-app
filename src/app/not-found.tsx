import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5">
      <h2 className="text-red-600 font-bold text-5xl">Oooops!</h2>
      <h2 className="text-xl">This page is not found</h2>
      <Link
        href="/"
        className="bg-purple-800 text-white hover:bg-purple-900 px-10 py-3 rounded-lg font-semibold "
      >
        Home
      </Link>
    </main>
  );
}
