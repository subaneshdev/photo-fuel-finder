
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CircleGauge } from "lucide-react";

interface DailyProgressProps {
  currentCalories: number;
  goalCalories: number;
}

const DailyProgress = ({ currentCalories, goalCalories }: DailyProgressProps) => {
  const progressPercentage = Math.min(Math.round((currentCalories / goalCalories) * 100), 100);
  
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "bg-nutrition-red";
    if (progressPercentage > 85) return "bg-nutrition-yellow";
    return "bg-nutrition-green";
  };

  return (
    <Card className="w-full max-w-xl mx-auto mt-6 overflow-hidden bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-nutrition-blue/20 shadow-lg shadow-nutrition-blue/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-nutrition-blue to-nutrition-green bg-clip-text text-transparent">
          <CircleGauge className="h-5 w-5" />
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative h-4">
            <Progress 
              value={progressPercentage} 
              className="h-full rounded-full bg-gray-100/50"
            />
            <div 
              className={`absolute inset-0 h-full rounded-full transition-transform duration-500 ${getProgressColor()}`}
              style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div className="space-y-1">
              <p className="text-gray-500">Consumed</p>
              <p className="font-medium text-xl bg-gradient-to-r from-nutrition-blue to-nutrition-red bg-clip-text text-transparent">
                {currentCalories} cal
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-gray-500">Daily Goal</p>
              <p className="font-medium text-xl bg-gradient-to-r from-nutrition-green to-nutrition-blue bg-clip-text text-transparent">
                {goalCalories} cal
              </p>
            </div>
          </div>
          <div className="text-center">
            {currentCalories <= goalCalories ? (
              <p className="text-sm text-nutrition-green font-medium">
                {Math.max(0, goalCalories - currentCalories)} calories remaining
              </p>
            ) : (
              <p className="text-sm text-nutrition-red font-medium">
                {currentCalories - goalCalories} calories over your goal
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
