
import { useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

interface HeaderProps {
  calorieGoal: number;
  onChangeGoal: (goal: number) => void;
}

const Header = ({ calorieGoal, onChangeGoal }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(calorieGoal.toString());

  const handleSaveGoal = () => {
    const newGoal = parseInt(tempGoal);
    if (!isNaN(newGoal) && newGoal > 0) {
      onChangeGoal(newGoal);
    } else {
      setTempGoal(calorieGoal.toString());
    }
    setIsEditingGoal(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="text-nutrition-green mr-2">Nutri</span>
              <span className="text-nutrition-blue">Vision</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>Today's Goal:</span>
              {isEditingGoal ? (
                <div className="ml-2 flex items-center">
                  <input
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className="w-20 h-8 px-2 border border-gray-300 rounded-md text-sm"
                    autoFocus
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleSaveGoal} 
                    className="ml-1 h-8"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsEditingGoal(true)} 
                  className="ml-2 font-semibold text-nutrition-blue hover:underline"
                >
                  {calorieGoal} cal
                </button>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden bg-white shadow-md overflow-hidden transition-all duration-300",
        isMenuOpen ? "max-h-40" : "max-h-0"
      )}>
        <div className="px-4 pt-2 pb-3 space-y-1">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>Today's Goal:</span>
            </div>
            {isEditingGoal ? (
              <div className="flex items-center">
                <input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="w-20 h-8 px-2 border border-gray-300 rounded-md text-sm"
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleSaveGoal} 
                  className="ml-1 h-8"
                >
                  Save
                </Button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingGoal(true)} 
                className="font-semibold text-nutrition-blue hover:underline"
              >
                {calorieGoal} cal
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
