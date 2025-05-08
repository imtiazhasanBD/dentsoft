import React from "react";
import { AuthForm } from "../components/auth-form";

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black/20 backdrop-blur-sm bg-cover bg-center">
      <div className="absolute inset-0 z-0 bg-cover">
        <img
          src="/bg-image.avif"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>
      </div>
      <div className="w-full p-6 z-20">
        <AuthForm />
      </div>
    </div>
  );
};

export default page;
