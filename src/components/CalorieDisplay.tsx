
import { FoodItem } from "../types/food";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface CalorieDisplayProps {
  foodItem: FoodItem | null;
  onAdd: (item: FoodItem) => void;
  onCancel: () => void;
}

const CalorieDisplay = ({ foodItem, onAdd, onCancel }: CalorieDisplayProps) => {
  if (!foodItem) return null;

  return (
    <Card className="w-full mt-6 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {foodItem.imageUrl && (
          <div className="md:w-1/3 h-48 md:h-auto">
            <img
              src={foodItem.imageUrl}
              alt={foodItem.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl">
              {foodItem.name}
            </CardTitle>
            <CardDescription>
              Nutritional Information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Calories</span>
                <span className="text-2xl font-bold text-nutrition-red">
                  {foodItem.calories} cal
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Protein</span>
                <span className="text-lg font-medium">
                  {foodItem.protein}g
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Carbs</span>
                <span className="text-lg font-medium">
                  {foodItem.carbs}g
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Fat</span>
                <span className="text-lg font-medium">
                  {foodItem.fat}g
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => onCancel()}
                variant="outline"
                className="flex-1 flex items-center justify-center"
              >
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button
                onClick={() => onAdd(foodItem)}
                className="flex-1 bg-nutrition-green hover:bg-green-600 flex items-center justify-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Add to Log
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default CalorieDisplay;
