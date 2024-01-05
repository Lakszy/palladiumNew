import React from "react";
import { PrimaryButton } from "../Button";
const ErrorPage: React.FC = () => {
  return (
    <main className="w-full flex flex-col justify-center items-center">
    <h1 className="text-6xl md:text-9xl font-extrabold tracking-widest">
      404
    </h1>
    <PrimaryButton btnClases="px-2 text-sm rounded md:rotate-12 md:absolute transition-all transform" lable="Page Not Found"/>
  </main>
  );
};

export default ErrorPage;