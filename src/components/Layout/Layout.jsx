import React from 'react'
import Navbar from './../Navbar/Navbar';
import Footer from './../Footer/Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
     <>
      <Navbar />
    <div className="min-h-screen relative bg-gradient-to-r from-indigo-100 to-purple-100 overflow-hidden">

       <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-indigo-200/30 blur-3xl rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-purple-200/30 blur-3xl rounded-full" />
      </div>

      <main className="pt-20 px-4">
        <Outlet />
      </main>

     
    </div>
     <Footer />
     </>
  );
}
