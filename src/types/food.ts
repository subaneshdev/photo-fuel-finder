
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  imageUrl?: string;
  timestamp: Date;
}

export interface DailyStats {
  date: string;
  totalCalories: number;
  goalCalories: number;
  items: FoodItem[];
}
