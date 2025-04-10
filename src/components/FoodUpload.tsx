
import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";

interface FoodUploadProps {
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
}

const FoodUpload = ({ onUpload, isProcessing }: FoodUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Check if file is too large (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Please upload an image smaller than 10MB");
      return;
    }
    
    // Process the file
    onUpload(file).catch(error => {
      console.error("Error uploading food image:", error);
      toast.error("Failed to process image. Please try again.");
    });
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // In a real app, this would open a camera view component
      // For simplicity, we're just opening the file selector
      openFileSelector();
      
      // Cleanup camera stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
      
      // Fallback to file selector
      openFileSelector();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
            dragActive ? "border-nutrition-blue bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="h-10 w-10 text-nutrition-blue animate-spin mb-2" />
              <p className="font-medium">Analyzing your food...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 text-center mb-4">
                <span className="font-medium">Drag & drop</span> your food photo here<br />
                or use the options below
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={openFileSelector}
                  className="flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" /> Browse Files
                </Button>
                <Button
                  onClick={openCamera}
                  className="bg-nutrition-blue hover:bg-blue-600 flex items-center"
                >
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodUpload;
