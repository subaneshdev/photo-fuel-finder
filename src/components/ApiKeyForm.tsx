
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { toast } from "sonner";

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Check if API key is already set
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // Show form if no API key is set
      setShowForm(true);
    }
  }, []);

  const saveApiKey = () => {
    if (!apiKey || apiKey.trim() === "") {
      toast.error("Please enter a valid API key");
      return;
    }

    // Basic validation for OpenAI API key format
    if (!apiKey.startsWith("sk-")) {
      toast.error("API key should start with 'sk-'");
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    toast.success("API key saved successfully");
    setShowForm(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setShowForm(true);
    toast.info("API key removed");
  };

  if (!showForm && apiKey) {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm text-green-600">OpenAI API key is set ✓</span>
        <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
          Change Key
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Set OpenAI API Key</CardTitle>
        <CardDescription>
          Your API key is stored locally in your browser and never sent to our servers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Get your API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              OpenAI Dashboard
            </a>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          if (localStorage.getItem("openai_api_key")) {
            clearApiKey();
          } else {
            setShowForm(false);
          }
        }}>
          Cancel
        </Button>
        <Button onClick={saveApiKey}>Save API Key</Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyForm;
