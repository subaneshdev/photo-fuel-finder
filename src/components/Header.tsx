
import { useState } from "react";
import { CalendarDays, Menu, X, SlidersHorizontal } from "lucide-react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import DailyGoalDialog from "./DailyGoalDialog";

interface HeaderProps {
  calorieGoal: number;
  onChangeGoal: (goal: number) => void;
}

const Header = ({ calorieGoal, onChangeGoal }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-nutrition-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="bg-gradient-to-r from-nutrition-green to-nutrition-blue bg-clip-text text-transparent">Nutri</span>
              <span className="bg-gradient-to-r from-nutrition-blue to-nutrition-red bg-clip-text text-transparent">Vision</span>
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>Today's Goal:</span>
              <span className="ml-2 font-semibold text-nutrition-blue">{calorieGoal} cal</span>
              <DailyGoalDialog
                trigger={
                  <Button size="icon" variant="ghost" className="ml-2" aria-label="Set Daily Goal">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                }
                initialGoal={calorieGoal}
                onSetGoal={onChangeGoal}
              />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <DailyGoalDialog
              trigger={
                <Button size="icon" variant="ghost" aria-label="Set Daily Goal">
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              }
              initialGoal={calorieGoal}
              onSetGoal={onChangeGoal}
            />
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
              <span className="font-semibold text-nutrition-blue ml-2">{calorieGoal} cal</span>
            </div>
            {/* Goal dialog also included above in mobile header controls */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
