import { Search, Menu, User, Upload, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-black border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-white font-bold text-2xl tracking-tight">
              Horn
            </span>
            <span className="bg-brand-orange text-black px-2 py-1 rounded font-bold text-2xl tracking-tight">
              Hub
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-white hover:text-brand-orange transition-colors font-medium text-sm uppercase tracking-wide">Home</a>
          <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors font-medium text-sm uppercase tracking-wide">Videos</a>
          <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors font-medium text-sm uppercase tracking-wide">Categories</a>
          <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors font-medium text-sm uppercase tracking-wide">Live Cams</a>
          <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors font-medium text-sm uppercase tracking-wide">Photos</a>
          <a href="#" className="text-gray-300 hover:text-brand-orange transition-colors font-medium text-sm uppercase tracking-wide">Community</a>
        </nav>

        {/* Search and user actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <Input 
                placeholder="Search..." 
                className="pl-4 pr-12 w-64 bg-gray-900 border-gray-700 text-white placeholder-gray-400 rounded-none"
              />
              <Button 
                size="sm"
                className="absolute right-0 top-0 h-full bg-brand-orange hover:bg-brand-orange-hover text-black px-4 rounded-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex bg-transparent border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-black transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-brand-orange">
            <Heart className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            className="bg-brand-orange hover:bg-brand-orange-hover text-black font-medium"
          >
            Log in
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;