"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AIService } from "@/lib/ai-service";

interface SystemPromptEditorProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export function SystemPromptEditor({ 
  systemPrompt, 
  onSystemPromptChange 
}: SystemPromptEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(systemPrompt);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    onSystemPromptChange(tempPrompt);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempPrompt(systemPrompt);
    setIsEditing(false);
  };

  const handleReset = () => {
    const defaultPrompt = AIService.getDefaultSystemPrompt();
    setTempPrompt(defaultPrompt);
    onSystemPromptChange(defaultPrompt);
    setIsEditing(false);
    setShowResetConfirm(false);
  };

  const isModified = systemPrompt !== AIService.getDefaultSystemPrompt();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Prompt Configuration</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Customize how Claude Sonnet 4 generates websites
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Prompt
              </Button>
              {isModified && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset to Default
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showResetConfirm && (
          <Alert>
            <AlertDescription className="flex items-center justify-between">
              <span>Reset to default system prompt? This will lose your custom changes.</span>
              <div className="flex gap-2 ml-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={tempPrompt}
              onChange={(e) => setTempPrompt(e.target.value)}
              className="min-h-64 font-mono text-sm"
              placeholder="Enter your custom system prompt..."
            />
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Tips:</strong> Be specific about styling preferences, layout requirements, 
                and functionality expectations. The prompt should guide Claude to generate 
                complete, functional HTML with embedded CSS and JavaScript.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-md border">
              <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                {systemPrompt}
              </pre>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Current Status:</strong> {isModified ? 'Custom prompt (modified)' : 'Default prompt'} • 
                <strong> Length:</strong> {systemPrompt.length} characters
              </p>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="font-medium text-blue-900 mb-2">How System Prompts Work</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• The system prompt defines Claude's role and output format</p>
            <p>• It instructs the AI to generate complete HTML with embedded CSS/JS</p>
            <p>• You can customize it to prefer certain design styles or frameworks</p>
            <p>• Changes apply to all new generations until reset</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}