"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewFrameProps {
  code: string;
}

export function PreviewFrame({ code }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  const getFrameStyles = () => {
    const baseStyles = "border rounded-md bg-white transition-all duration-300";
    
    switch (viewportSize) {
      case 'mobile':
        return `${baseStyles} w-80 h-96 mx-auto`;
      case 'tablet':
        return `${baseStyles} w-full max-w-3xl h-96 mx-auto`;
      default:
        return `${baseStyles} w-full h-96`;
    }
  };

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(code);
      newWindow.document.close();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Website Preview - Fullscreen</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                Open in New Tab
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                Exit Fullscreen
              </Button>
            </div>
          </div>
          <iframe
            ref={iframeRef}
            className="flex-1 w-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Preview</CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={viewportSize} onValueChange={(value) => setViewportSize(value as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="desktop" className="text-xs px-2 py-1">Desktop</TabsTrigger>
              <TabsTrigger value="tablet" className="text-xs px-2 py-1">Tablet</TabsTrigger>
              <TabsTrigger value="mobile" className="text-xs px-2 py-1">Mobile</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={openInNewTab}>
            New Tab
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            Fullscreen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center p-4 bg-gray-100 rounded-md">
          <iframe
            ref={iframeRef}
            className={getFrameStyles()}
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>
            Preview is sandboxed for security. 
            {viewportSize === 'mobile' && ' Mobile view (320px width)'}
            {viewportSize === 'tablet' && ' Tablet view (768px width)'}
            {viewportSize === 'desktop' && ' Desktop view (full width)'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}