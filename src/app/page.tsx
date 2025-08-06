'use client';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TagSection } from './components/TagSection';
import { InstructionSection } from './components/InstructionSection';
import { SaleSection } from './components/SaleSection';
import AboutUs from './components/Aboutus';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Page() {
  const router = useRouter();
  const [showlogin, setShowLogin] = useState(false);

    useEffect(() => {
       toast.info('Please log in to access additional features.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

    },[])
   

  return (
    <>
      {/* Toast container for showing toasts */}
      <ToastContainer />

      <div className="min-h-screen text-gray-800 m-0 p-0 flex flex-col ">
        <header className="w-full">
          <Header showlogin={showlogin}/>
        </header>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          <HeroSection />
          <TagSection />
          <InstructionSection />
          <SaleSection />
          <AboutUs />
        </main>

        <div className="w-full h-[2px] bg-gray-200 my-8" />

        <footer className="w-full">
          <Footer  />
        </footer>
      </div>
    </>
  );
}

export default Page;
