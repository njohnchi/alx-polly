import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex justify-center">
          <h1 className="text-2xl font-bold">Polly</h1>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}