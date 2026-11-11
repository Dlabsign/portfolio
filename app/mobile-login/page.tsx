import React from 'react';
import MobileLoginFrame from '@/components/MobileLoginFrame';

export const metadata = {
  title: 'Mobile Frame (375x812) - Login Screen',
  description: 'Mobile frame 375x812 dengan background putih, header, form login, dan tombol Sign In warna biru.',
};

export default function MobileLoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 antialiased">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold text-slate-800">Mobile Frame Preview</h1>
        <p className="text-sm text-slate-500 font-mono mt-1">Viewport: 375 × 812 px</p>
      </div>
      <MobileLoginFrame />
    </main>
  );
}
