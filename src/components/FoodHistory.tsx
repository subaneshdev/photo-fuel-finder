
import { useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FoodItem } from "../types/food";
import { cn } from "../lib/utils";

interface FoodHistoryProps {
  foodItems: FoodItem[];
  onDelete: (id: string) => void;
}

const FoodHistory = ({ foodItems, onDelete }: FoodHistoryProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (foodItems.length === 0) {
    return (
      <Card className="w-full mt-6 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-nutrition-blue/20 shadow-lg shadow-nutrition-blue/10">
        <CardHeader>
          <CardTitle className="text-lg bg-gradient-to-r from-nutrition-blue to-nutrition-green bg-clip-text text-transparent">Today's Food Log</CardTitle>
          <CardDescription>No items logged today</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Sort items by timestamp (most recent first)
  const sortedItems = [...foodItems].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card className="w-full mt-6 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-nutrition-blue/20 shadow-lg shadow-nutrition-blue/10">
      <CardHeader>
        <CardTitle className="text-lg bg-gradient-to-r from-nutrition-blue to-nutrition-green bg-clip-text text-transparent">Today's Food Log</CardTitle>
        <CardDescription>
          {foodItems.length} {foodItems.length === 1 ? 'item' : 'items'} logged
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {sortedItems.map((item) => (
            <li 
              key={item.id}
              className="border rounded-md overflow-hidden transition-all duration-200 bg-white/50 hover:bg-white/80"
            >
              <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              >
                <div className="flex items-center">
                  {item.imageUrl && (
                    <div className="w-10 h-10 rounded overflow-hidden mr-3 border">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      {format(item.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-nutrition-red mr-4">
                    {item.calories} cal
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="h-8 w-8 text-gray-500 hover:text-nutrition-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className={cn(
                "grid grid-rows-[0fr] transition-all duration-200 bg-gray-50",
                expandedItem === item.id && "grid-rows-[1fr] border-t"
              )}>
                <div className="overflow-hidden">
                  <div className="p-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Protein</p>
                      <p className="font-medium">{item.protein}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Carbs</p>
                      <p className="font-medium">{item.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fat</p>
                      <p className="font-medium">{item.fat}g</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default FoodHistory;
