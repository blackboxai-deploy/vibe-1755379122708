"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeDisplayProps {
  code: string;
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatHTML = (html: string) => {
    // Simple HTML formatting for better readability
    return html
      .replace(/></g, '>\n<')
      .replace(/(<\/[^>]+>)(<[^>\/]+[^>]*>)/g, '$1\n$2')
      .replace(/(<script[^>]*>)/g, '\n$1\n')
      .replace(/(<\/script>)/g, '\n$1\n')
      .replace(/(<style[^>]*>)/g, '\n$1\n')
      .replace(/(<\/style>)/g, '\n$1\n')
      .split('\n')
      .map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        // Add basic indentation
        const depth = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2;
        const indent = '  '.repeat(Math.max(0, depth));
        
        return `${String(index + 1).padStart(3, ' ')} │ ${indent}${trimmed}`;
      })
      .filter(line => line.trim())
      .join('\n');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated HTML Code</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border">
          <pre className="p-4 text-sm font-mono bg-muted/50">
            <code className="language-html whitespace-pre-wrap">
              {formatHTML(code)}
            </code>
          </pre>
        </ScrollArea>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            <strong>Lines:</strong> {code.split('\n').length} • 
            <strong> Characters:</strong> {code.length} • 
            <strong> Size:</strong> {(code.length / 1024).toFixed(1)}KB
          </p>
        </div>
      </CardContent>
    </Card>
  );
}