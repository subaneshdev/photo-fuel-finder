
import { Progress } from "../components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "@/lib/utils";

interface DailyProgressProps {
  currentCalories: number;
  goalCalories: number;
}

const DailyProgress = ({ currentCalories, goalCalories }: DailyProgressProps) => {
  const progressPercentage = Math.min(Math.round((currentCalories / goalCalories) * 100), 100);
  
  let progressColor = "bg-gradient-to-r from-green-400 to-green-500";
  if (progressPercentage > 85) {
    progressColor = "bg-gradient-to-r from-yellow-400 to-yellow-500";
  }
  if (progressPercentage >= 100) {
    progressColor = "bg-gradient-to-r from-red-400 to-red-500";
  }
  
  return (
    <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <div className="relative h-4">
            <Progress 
              value={progressPercentage} 
              className="h-4 rounded-full bg-gray-100"
            />
            <div 
              className={cn(
                "absolute inset-0 h-full rounded-full transition-transform duration-500",
                progressColor
              )}
              style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm font-medium">
            <div className="flex flex-col items-start gap-1">
              <span className="text-lg font-bold text-gray-700">{currentCalories}</span>
              <span className="text-gray-500 text-xs">calories consumed</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-lg font-bold text-gray-700">{goalCalories}</span>
              <span className="text-gray-500 text-xs">daily goal</span>
            </div>
          </div>
          <div className="text-center">
            {currentCalories <= goalCalories ? (
              <span className="text-sm font-medium text-green-600">
                {Math.max(0, goalCalories - currentCalories)} calories remaining
              </span>
            ) : (
              <span className="text-sm font-medium text-red-500">
                {currentCalories - goalCalories} calories over your goal
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
