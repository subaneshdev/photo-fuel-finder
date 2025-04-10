
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import FoodUpload from "../components/FoodUpload";
import CalorieDisplay from "../components/CalorieDisplay";
import DailyProgress from "../components/DailyProgress";
import FoodHistory from "../components/FoodHistory";
import { FoodItem } from "../types/food";
import { recognizeFood } from "../services/foodRecognition";
import { Card, CardContent } from "../components/ui/card";

const DEFAULT_CALORIE_GOAL = 2000;

const Index = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState(() => {
    const saved = localStorage.getItem("calorieGoal");
    return saved ? parseInt(saved) : DEFAULT_CALORIE_GOAL;
  });

  // Load food items from localStorage on initial render
  useEffect(() => {
    const savedItems = localStorage.getItem("foodItems");
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Convert string timestamps back to Date objects
        const items = parsedItems.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setFoodItems(items);
      } catch (error) {
        console.error("Error parsing food items from localStorage:", error);
      }
    }
  }, []);

  // Save food items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
  }, [foodItems]);

  // Save calorie goal to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("calorieGoal", calorieGoal.toString());
  }, [calorieGoal]);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    toast.info("Analyzing your food...", { duration: 3000 });
    
    try {
      const result = await recognizeFood(file);
      
      if (result) {
        setCurrentItem(result);
        toast.success(`Identified: ${result.name}`);
      } else {
        toast.error("Could not recognize food in the image. Please try another photo.");
      }
    } catch (error) {
      console.error("Error recognizing food:", error);
      toast.error("An error occurred while analyzing your food. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddFood = (item: FoodItem) => {
    setFoodItems(prev => [...prev, item]);
    setCurrentItem(null);
    toast.success(`Added ${item.name} to your food log`);
  };

  const handleDeleteFood = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from your food log");
  };

  const handleChangeGoal = (goal: number) => {
    setCalorieGoal(goal);
    toast.success(`Daily calorie goal updated to ${goal}`);
  };

  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header calorieGoal={calorieGoal} onChangeGoal={handleChangeGoal} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Track Your Food
            </h2>
            
            {!currentItem && (
              <FoodUpload onUpload={handleUpload} isProcessing={isProcessing} />
            )}
            
            {currentItem && (
              <CalorieDisplay 
                foodItem={currentItem} 
                onAdd={handleAddFood} 
                onCancel={() => setCurrentItem(null)} 
              />
            )}
            
            <FoodHistory 
              foodItems={foodItems} 
              onDelete={handleDeleteFood} 
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Summary
            </h2>
            
            <DailyProgress 
              currentCalories={totalCalories} 
              goalCalories={calorieGoal} 
            />
            
            <Card className="p-4">
              <CardContent>
                <h3 className="font-medium mb-2">How to use NutriVision</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                  <li>Take a photo of your food or upload an existing image</li>
                  <li>Our AI will identify the food and calculate calories</li>
                  <li>Review the nutritional information</li>
                  <li>Add it to your daily food log</li>
                  <li>Track your progress toward your daily goal</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
