
import { FoodItem } from "../types/food";

// Nutritional database for common foods (fallback and enhancement)
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

// Get API key from localStorage or use fallback for development
const getOpenAIKey = (): string => {
  return localStorage.getItem('openai_api_key') || '';
};

export async function recognizeFood(imageFile: File): Promise<FoodItem | null> {
  try {
    const apiKey = getOpenAIKey();
    
    if (!apiKey) {
      throw new Error("OpenAI API key is not set. Please set your API key in the settings.");
    }
    
    // Convert the image file to base64
    const base64Image = await fileToBase64(imageFile);
    if (!base64Image) return null;

    // Create a URL for the uploaded image (for display purposes)
    const imageUrl = URL.createObjectURL(imageFile);

    // Call OpenAI API to analyze the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a nutrition expert. Identify the food in the image and provide nutritional information. Return ONLY a JSON object with these fields: name (string), calories (number), protein (number in grams), carbs (number in grams), fat (number in grams). Don't include any other text."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "What food is this? Provide nutritional information." },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      
      // Check for quota exceeded error specifically
      if (errorData.error?.code === "insufficient_quota") {
        throw new Error("Your OpenAI API key has exceeded its quota. Please check your OpenAI account billing status or use a different API key.");
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("OpenAI response:", data);

    // Parse the response - we expect JSON in the response content
    let foodInfo;
    try {
      const content = data.choices[0].message.content;
      foodInfo = JSON.parse(content);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      throw new Error("Failed to parse food information from API response");
    }

    // Validate the response has the required fields
    if (!foodInfo.name || !foodInfo.calories) {
      // If missing essential data, try to find it in our database by name
      const lowerCaseName = foodInfo.name?.toLowerCase() || "";
      const dbMatch = Object.entries(foodDatabase).find(
        ([key, _]) => key.includes(lowerCaseName) || lowerCaseName.includes(key)
      );
      
      if (dbMatch) {
        foodInfo = { ...dbMatch[1], ...foodInfo };
      } else {
        throw new Error("Incomplete food information from API");
      }
    }

    // Create the food item with all required fields
    return {
      id: generateId(),
      name: foodInfo.name,
      calories: foodInfo.calories,
      protein: foodInfo.protein || 0,
      carbs: foodInfo.carbs || 0,
      fat: foodInfo.fat || 0,
      imageUrl,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error recognizing food:", error);
    throw error; // Re-throw the error so it can be handled by the calling code
  }
}

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        resolve(null);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
