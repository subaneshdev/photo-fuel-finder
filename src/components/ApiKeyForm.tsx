
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { toast } from "sonner";
import { AlertCircle, ExternalLink } from "lucide-react";

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [keyHasQuotaIssue, setKeyHasQuotaIssue] = useState(false);

  useEffect(() => {
    // Check if API key is already set
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      
      // Check if we've recorded a quota issue with this key
      const quotaIssue = localStorage.getItem("openai_api_quota_issue");
      if (quotaIssue === "true") {
        setKeyHasQuotaIssue(true);
        setShowForm(true); // Show form if there's a quota issue
      }
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
    localStorage.removeItem("openai_api_quota_issue"); // Clear any previous quota issues
    setKeyHasQuotaIssue(false);
    toast.success("API key saved successfully");
    setShowForm(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem("openai_api_key");
    localStorage.removeItem("openai_api_quota_issue");
    setApiKey("");
    setKeyHasQuotaIssue(false);
    setShowForm(true);
    toast.info("API key removed");
  };

  if (!showForm && apiKey) {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className={`text-sm ${keyHasQuotaIssue ? "text-amber-600" : "text-green-600"}`}>
          {keyHasQuotaIssue ? "⚠️ OpenAI API key has quota issues" : "OpenAI API key is set ✓"}
        </span>
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
              className="text-blue-500 hover:underline flex items-center gap-1 inline-flex"
            >
              OpenAI Dashboard <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          
          {keyHasQuotaIssue && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">API Key Quota Exceeded</p>
                <p className="mt-1">Your current API key has exceeded its usage quota. To fix this:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Check your OpenAI account billing status</li>
                  <li>Add a payment method if using a free tier</li>
                  <li>Increase your spending limits</li>
                  <li>Or use a different API key</li>
                </ul>
                <a
                  href="https://platform.openai.com/account/billing/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-amber-700 font-medium hover:underline flex items-center gap-1"
                >
                  Go to OpenAI Billing <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
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
