"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CodeDisplay } from "./CodeDisplay";
import { PreviewFrame } from "./PreviewFrame";
import { SystemPromptEditor } from "./SystemPromptEditor";
import { AIService } from "@/lib/ai-service";

interface GenerationState {
  isGenerating: boolean;
  generatedCode: string;
  error: string | null;
  lastPrompt: string;
}

export function WebsiteGenerator() {
  const [prompt, setPrompt] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(AIService.getDefaultSystemPrompt());
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    generatedCode: "",
    error: null,
    lastPrompt: ""
  });

  const examplePrompts = [
    "Create a modern landing page for a meditation app with calming colors and smooth animations",
    "Build a portfolio website for a photographer with a dark theme and image gallery",
    "Design a restaurant homepage with menu showcase and reservation form",
    "Create a tech startup landing page with hero section and feature cards",
    "Build a personal blog homepage with article previews and sidebar"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setState(prev => ({ ...prev, error: "Please enter a prompt" }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      error: null,
      lastPrompt: prompt 
    }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemPrompt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Generation failed');
      }

      setState(prev => ({
        ...prev,
        generatedCode: data.code,
        isGenerating: false,
        error: null
      }));

    } catch (error) {
      console.error('Generation error:', error);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };

  const handleCopyCode = () => {
    if (state.generatedCode) {
      navigator.clipboard.writeText(state.generatedCode);
    }
  };

  const handleDownload = () => {
    if (state.generatedCode) {
      const blob = new Blob([state.generatedCode], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-website.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prompt Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Website</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the website you want to create (e.g., 'Create a modern landing page for a coffee shop with warm colors and online ordering section')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-32 resize-none"
            disabled={state.isGenerating}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleGenerate}
              disabled={state.isGenerating || !prompt.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {state.isGenerating ? "Generating..." : "Generate Website"}
            </Button>
            
            {state.generatedCode && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleCopyCode}
                >
                  Copy Code
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                >
                  Download HTML
                </Button>
              </>
            )}
          </div>

          {/* Example Prompts */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Try these example prompts:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-auto p-2 text-left whitespace-normal"
                  onClick={() => setPrompt(example)}
                  disabled={state.isGenerating}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {state.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {state.isGenerating && (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-75"></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse delay-150"></div>
              <span className="ml-4 text-muted-foreground">
                Claude Sonnet 4 is crafting your website...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {state.generatedCode && (
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
            <TabsTrigger value="prompt">System Prompt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-4">
            <PreviewFrame code={state.generatedCode} />
          </TabsContent>
          
          <TabsContent value="code" className="mt-4">
            <CodeDisplay code={state.generatedCode} />
          </TabsContent>
          
          <TabsContent value="prompt" className="mt-4">
            <SystemPromptEditor 
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}