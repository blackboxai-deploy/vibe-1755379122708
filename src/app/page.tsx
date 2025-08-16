import { WebsiteGenerator } from "@/components/WebsiteGenerator";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Website Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your dream website and watch Claude Sonnet 4 bring it to life. 
            Generate complete HTML, CSS, and JavaScript in seconds with live preview.
          </p>
        </header>
        
        <WebsiteGenerator />
      </div>
    </div>
  );
}