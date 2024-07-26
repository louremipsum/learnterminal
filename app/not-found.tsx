import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center w-screen">
      <div className="bg-gray-800 text-green-400 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center">
          <div className="text-sm">Mainframe</div>
          <div className="flex space-x-2">
            <span className="block w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="block w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="block w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg font-mono">404: Page not found</p>
          <p className="mt-2">
            It looks like you've found the edge of the known universe.
          </p>
        </div>
        <div className="mt-6">
          <Link href="/dashboard">
            <span className="animate-pulse text-lg text-green-600 mr-2">
              &gt;
            </span>
            <span className="underline-offset-4 underline">return home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
