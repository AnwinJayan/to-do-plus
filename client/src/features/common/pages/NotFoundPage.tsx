import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-base-100 text-base-content px-4">
      <h1 className="text-5xl font-bold text-error">404</h1>
      <p className="mt-2 text-lg">Page not found.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
}
