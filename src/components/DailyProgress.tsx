
import { Progress } from "../components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "@/lib/utils";

interface DailyProgressProps {
  currentCalories: number;
  goalCalories: number;
}

const DailyProgress = ({ currentCalories, goalCalories }: DailyProgressProps) => {
  const progressPercentage = Math.min(Math.round((currentCalories / goalCalories) * 100), 100);
  
  let progressColor = "bg-nutrition-green";
  if (progressPercentage > 85) {
    progressColor = "bg-nutrition-yellow";
  }
  if (progressPercentage >= 100) {
    progressColor = "bg-nutrition-red";
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            <div 
              className={cn("absolute inset-0 h-full rounded-full", progressColor)}
              style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium">{currentCalories}</span>
              <span className="text-gray-500 ml-1">consumed</span>
            </div>
            <div>
              <span className="text-gray-500 mr-1">goal</span>
              <span className="font-medium">{goalCalories}</span>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            {currentCalories <= goalCalories ? (
              <span>{Math.max(0, goalCalories - currentCalories)} calories remaining</span>
            ) : (
              <span className="text-nutrition-red">{currentCalories - goalCalories} calories over your goal</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyProgress;
