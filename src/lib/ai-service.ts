interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GenerateWebsiteParams {
  prompt: string;
  systemPrompt?: string;
}

export class AIService {
  private static readonly ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
  private static readonly MODEL = 'openrouter/anthropic/claude-sonnet-4';
  
  private static readonly DEFAULT_HEADERS = {
    'customerId': 'cus_SGPn4uhjPI0F4w',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer xxx'
  };

  static getDefaultSystemPrompt(): string {
    return `You are an expert web developer specializing in creating beautiful, functional single-page websites. When given a user prompt, generate a complete HTML document that includes:

1. **Complete HTML structure** with semantic elements
2. **Embedded CSS** in <style> tags with modern, responsive design
3. **JavaScript functionality** in <script> tags for interactivity
4. **Modern design principles**: Clean layout, good typography, proper spacing
5. **Responsive design**: Works on mobile and desktop
6. **Accessibility**: Proper ARIA labels, semantic HTML, good contrast

**Requirements:**
- Generate ONLY the HTML code, nothing else
- Include ALL CSS and JavaScript inline within the HTML
- Use modern CSS features (flexbox, grid, custom properties)
- Ensure the website is fully functional and visually appealing
- Use semantic HTML5 elements
- Include meta tags for responsive design
- Add hover effects and smooth transitions
- Use a cohesive color scheme and typography

**Output Format:**
Return only the complete HTML code starting with <!DOCTYPE html> and ending with </html>. Do not include any explanations, markdown formatting, or code blocks.`;
  }

  static async generateWebsite({ prompt, systemPrompt }: GenerateWebsiteParams): Promise<string> {
    try {
      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: this.DEFAULT_HEADERS,
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt || this.getDefaultSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 8000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from AI');
      }

      const generatedCode = data.choices[0].message.content;
      
      // Clean up the response - remove any markdown formatting if present
      return this.cleanGeneratedCode(generatedCode);

    } catch (error) {
      console.error('AI Generation Error:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  private static cleanGeneratedCode(code: string): string {
    // Remove markdown code blocks if present
    let cleaned = code.replace(/```html\n?/g, '').replace(/```\n?$/g, '');
    
    // Ensure it starts with DOCTYPE
    if (!cleaned.trim().toLowerCase().startsWith('<!doctype')) {
      cleaned = cleaned.trim();
    }
    
    return cleaned;
  }

  static validateGeneratedCode(code: string): boolean {
    const trimmed = code.trim().toLowerCase();
    return trimmed.startsWith('<!doctype') && trimmed.includes('</html>');
  }
}