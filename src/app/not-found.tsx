import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl">🌰</div>
      <h1 className="mt-4 text-4xl font-extrabold text-heading">Off target!</h1>
      <p className="mt-3 max-w-md text-ink/70">
        We couldn&apos;t find that page. It may have been moved, or the ball&apos;s gone into Row Z.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/shop" className="btn btn-outline">Shop the collection</Link>
      </div>
    </div>
  );
}
