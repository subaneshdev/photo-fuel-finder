
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import FoodUpload from "../components/FoodUpload";
import CalorieDisplay from "../components/CalorieDisplay";
import FoodHistory from "../components/FoodHistory";
import DailyProgress from "../components/DailyProgress";
import ApiKeyForm from "../components/ApiKeyForm";
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

  useEffect(() => {
    const savedItems = localStorage.getItem("foodItems");
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
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

  useEffect(() => {
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem("calorieGoal", calorieGoal.toString());
  }, [calorieGoal]);

  const handleUpload = async (file: File) => {
    if (!localStorage.getItem("gemini_api_key")) {
      toast.error("Please set your Gemini API key first");
      return;
    }
    
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
    } catch (error: any) {
      console.error("Error recognizing food:", error);
      
      if (error.message && error.message.includes("quota")) {
        localStorage.setItem("gemini_api_quota_issue", "true");
        toast.error("Your Gemini API key has exceeded its quota. Please check your quota status or use a different key.", {
          duration: 6000
        });
      } else {
        toast.error("An error occurred while analyzing your food. Please try again.");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header calorieGoal={calorieGoal} onChangeGoal={handleChangeGoal} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DailyProgress 
          currentCalories={totalCalories} 
          goalCalories={calorieGoal} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-nutrition-blue to-nutrition-green bg-clip-text text-transparent">
              Track Your Food
            </h2>
            
            <ApiKeyForm />
            
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
            <h2 className="text-xl font-semibold bg-gradient-to-r from-nutrition-red to-nutrition-yellow bg-clip-text text-transparent">
              Summary
            </h2>
            
            <Card className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm border-nutrition-blue/20 shadow-lg shadow-nutrition-blue/10">
              <CardContent>
                <h3 className="font-medium mb-2 text-nutrition-blue">How to use NutriVision</h3>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                  <li className="hover:text-nutrition-green transition-colors">Add your Gemini API key to enable food recognition</li>
                  <li className="hover:text-nutrition-blue transition-colors">Take a photo of your food or upload an existing image</li>
                  <li className="hover:text-nutrition-red transition-colors">Our AI will identify the food and calculate calories</li>
                  <li className="hover:text-nutrition-yellow transition-colors">Review the nutritional information</li>
                  <li className="hover:text-nutrition-green transition-colors">Add it to your daily food log</li>
                  <li className="hover:text-nutrition-blue transition-colors">Track your progress toward your daily goal</li>
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
