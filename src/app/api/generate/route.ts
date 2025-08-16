import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemPrompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (prompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Prompt must be at least 10 characters long' },
        { status: 400 }
      );
    }

    console.log('Generating website for prompt:', prompt.substring(0, 100) + '...');

    const generatedCode = await AIService.generateWebsite({
      prompt: prompt.trim(),
      systemPrompt: systemPrompt?.trim()
    });

    if (!AIService.validateGeneratedCode(generatedCode)) {
      throw new Error('Generated code is not valid HTML');
    }

    return NextResponse.json({
      success: true,
      code: generatedCode,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Generation API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to generate website',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}