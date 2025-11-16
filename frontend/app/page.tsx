import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to BookTracker</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your personal space to discover, track, and manage your reading journey.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Login
          </Link>
          <Link href="/register" className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
