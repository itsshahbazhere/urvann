import { Leaf } from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-700 via-green-500 to-green-300 py-7 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <Leaf className="h-7 w-7" />
          Urvann Plant Store
        </div>
        <div className="text-white/80 font-medium text-sm">
          &copy; {new Date().getFullYear()} Urvann. All rights reserved.
        </div>
        <div className="text-white/80 font-medium text-xs">
          Made with <span className="text-red-200">♥</span> by the Urvann Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
