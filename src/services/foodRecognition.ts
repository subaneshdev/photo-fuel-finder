
import { FoodItem } from "../types/food";

// Mock database of food items and their nutritional info
const foodDatabase: Record<string, Omit<FoodItem, "id" | "timestamp" | "imageUrl">> = {
  "apple": { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  "banana": { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  "orange": { name: "Orange", calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  "pizza": { name: "Pizza Slice", calories: 285, protein: 12, carbs: 36, fat: 10 },
  "burger": { name: "Hamburger", calories: 350, protein: 15, carbs: 33, fat: 18 },
  "salad": { name: "Garden Salad", calories: 120, protein: 3, carbs: 10, fat: 7 },
  "pasta": { name: "Pasta", calories: 200, protein: 7, carbs: 40, fat: 2 },
  "rice": { name: "White Rice", calories: 150, protein: 3, carbs: 33, fat: 0.5 },
  "chicken": { name: "Grilled Chicken", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  "steak": { name: "Steak", calories: 250, protein: 25, carbs: 0, fat: 16 },
};

// In a real app, this would connect to a computer vision API
export async function recognizeFood(imageFile: File): Promise<FoodItem | null> {
  return new Promise((resolve) => {
    // Simulate API processing time
    setTimeout(() => {
      // In a real app, this would be the result from an AI vision model
      const recognizedFoods = [
        "apple", "banana", "orange", "pizza", "burger", 
        "salad", "pasta", "rice", "chicken", "steak"
      ];
      
      // Randomly select a "recognized" food
      const randomIndex = Math.floor(Math.random() * recognizedFoods.length);
      const foodKey = recognizedFoods[randomIndex];
      const foodInfo = foodDatabase[foodKey];
      
      if (foodInfo) {
        // Create a URL for the uploaded image
        const imageUrl = URL.createObjectURL(imageFile);
        
        resolve({
          id: generateId(),
          ...foodInfo,
          imageUrl,
          timestamp: new Date()
        });
      } else {
        resolve(null);
      }
    }, 1500); // Simulate 1.5s processing time
  });
}

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
