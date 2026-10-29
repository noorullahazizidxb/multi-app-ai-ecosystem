import { GoogleGenAI, Type } from '@google/genai';

export interface GeminiConfig {
  apiKey: string;
  fastModel: string;
  copilotModel: string;
}

export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  model?: 'fast' | 'copilot';
  temperature?: number;
  maxOutputTokens?: number;
  responseSchema?: Record<string, unknown>;
  images?: Array<{
    mimeType: string;
    data: string; // base64
  }>;
}

export interface GenerateResult<T = unknown> {
  data: T;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  model: string;
}

export class GeminiClient {
  private readonly client: GoogleGenAI;
  private readonly fastModel: string;
  private readonly copilotModel: string;

  constructor(config?: Partial<GeminiConfig>) {
    const apiKey = config?.apiKey || process.env.GEMINI_API_KEY || '';
    this.fastModel = config?.fastModel || process.env.GEMINI_MODEL_FAST || 'gemini-2.5-flash';
    this.copilotModel = config?.copilotModel || process.env.GEMINI_MODEL_COPILOT || 'gemini-2.5-pro';
    this.client = new GoogleGenAI({ apiKey });
  }

  async generate<T = string>(options: GenerateOptions): Promise<GenerateResult<T>> {
    const modelName = options.model === 'copilot' ? this.copilotModel : this.fastModel;
    const startTime = Date.now();

    const contents: Array<{ role: string; parts: Array<Record<string, unknown>> }> = [];

    const parts: Array<Record<string, unknown>> = [];
    parts.push({ text: options.prompt });

    if (options.images) {
      for (const img of options.images) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data,
          },
        });
      }
    }

    contents.push({ role: 'user', parts });

    const generateConfig: Record<string, unknown> = {
      model: modelName,
      contents,
    };

    if (options.systemInstruction) {
      generateConfig.systemInstruction = options.systemInstruction;
    }

    const generationConfig: Record<string, unknown> = {};
    if (options.temperature !== undefined) {
      generationConfig.temperature = options.temperature;
    }
    if (options.maxOutputTokens !== undefined) {
      generationConfig.maxOutputTokens = options.maxOutputTokens;
    }
    if (options.responseSchema) {
      generationConfig.responseMimeType = 'application/json';
      generationConfig.responseSchema = options.responseSchema;
    }

    if (Object.keys(generationConfig).length > 0) {
      generateConfig.config = generationConfig;
    }

    const response = await this.client.models.generateContent(generateConfig as any);
    const latencyMs = Date.now() - startTime;

    const text = response.text || '';
    const usage = {
      promptTokens: response.usageMetadata?.promptTokenCount || 0,
      completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: response.usageMetadata?.totalTokenCount || 0,
    };

    let data: T;
    if (options.responseSchema) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = text as unknown as T;
      }
    } else {
      data = text as unknown as T;
    }

    return { data, usage, latencyMs, model: modelName };
  }

  /**
   * Generate with structured JSON output using a Zod-like schema definition.
   */
  async generateStructured<T>(options: GenerateOptions & { responseSchema: Record<string, unknown> }): Promise<GenerateResult<T>> {
    return this.generate<T>(options);
  }
}
