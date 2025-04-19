import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Educational Platform</h1>
        
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Please select your account type to continue</p>
          </div>
          
          <div className="mt-8 space-y-4">
            <Link href="/student/login" 
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login as Student
            </Link>
            
            <Link href="/faculty/login"
                  className="w-full flex items-center justify-center px-4 py-3 border border-blue-700 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Login as Faculty
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>An educational platform designed to enhance learning</p>
        </div>
      </div>
    </main>
  );
}
