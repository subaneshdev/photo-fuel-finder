
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
const getGeminiKey = (): string => {
  return localStorage.getItem('gemini_api_key') || '';
};

export async function recognizeFood(imageFile: File): Promise<FoodItem | null> {
  try {
    const apiKey = getGeminiKey();
    
    if (!apiKey) {
      throw new Error("Gemini API key is not set. Please set your API key in the settings.");
    }
    
    // Convert the image file to base64
    const base64Image = await fileToBase64(imageFile);
    if (!base64Image) return null;

    // Create a URL for the uploaded image (for display purposes)
    const imageUrl = URL.createObjectURL(imageFile);

    // Get only the base64 data without the prefix
    const base64Data = base64Image.split(',')[1];

    console.log("Calling Gemini API with image data...");
    
    // Call Gemini API with the 1.5-flash model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are a nutrition expert. Identify the food in the image and provide nutritional information. Return ONLY a JSON object with these fields: name (string), calories (number), protein (number in grams), carbs (number in grams), fat (number in grams). Don't include any other text."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      
      // Check for quota exceeded error specifically
      if (errorData.error?.code === 429 || errorData.error?.message?.includes("quota")) {
        localStorage.setItem("gemini_api_quota_issue", "true");
        throw new Error("Your Gemini API key has exceeded its quota. Please check your Google AI Studio account or use a different API key.");
      }
      
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Gemini response:", data);

    // Parse the response - we expect JSON in the response content
    let foodInfo;
    try {
      const content = data.candidates[0].content.parts[0].text;
      console.log("Raw response text:", content);
      
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[^]*\}/);
      if (jsonMatch) {
        console.log("Found JSON in response:", jsonMatch[0]);
        try {
          foodInfo = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error("Failed to parse JSON from response");
        }
      } else {
        // If no JSON object is found, let's try to create one from the text
        console.log("No JSON found, attempting to extract information from text");
        foodInfo = extractNutritionFromText(content);
        if (!foodInfo) {
          throw new Error("No JSON found in response");
        }
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      
      // Fallback to our food database with a generic entry
      foodInfo = {
        name: "Unknown Food",
        calories: 200,
        protein: 5,
        carbs: 15,
        fat: 10
      };
      console.log("Using fallback food info:", foodInfo);
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
        // Use generic fallback
        foodInfo = {
          ...foodInfo,
          name: foodInfo.name || "Unknown Food",
          calories: foodInfo.calories || 200
        };
      }
    }

    console.log("Final food info:", foodInfo);

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

// Helper function to extract nutrition information from text when JSON parsing fails
function extractNutritionFromText(text: string): any {
  // Simple regex patterns to find nutrition information
  const nameMatch = text.match(/name[:\s]+([^\n,]+)/i);
  const caloriesMatch = text.match(/calories[:\s]+(\d+)/i);
  const proteinMatch = text.match(/protein[:\s]+(\d+\.?\d*)/i);
  const carbsMatch = text.match(/carbs[:\s]+(\d+\.?\d*)/i);
  const fatMatch = text.match(/fat[:\s]+(\d+\.?\d*)/i);
  
  if (nameMatch || caloriesMatch) {
    return {
      name: nameMatch ? nameMatch[1].trim() : "Unknown Food",
      calories: caloriesMatch ? parseInt(caloriesMatch[1]) : 200,
      protein: proteinMatch ? parseFloat(proteinMatch[1]) : 0,
      carbs: carbsMatch ? parseFloat(carbsMatch[1]) : 0,
      fat: fatMatch ? parseFloat(fatMatch[1]) : 0
    };
  }
  
  return null;
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
