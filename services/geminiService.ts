
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, EvaluationMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the JSON response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "Overall score out of 100 based on artistic merit and technique.",
    },
    title: {
      type: Type.STRING,
      description: "A creative and artistic title for the photo in Japanese.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief overall impression of the photo in Japanese.",
    },
    composition: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Score out of 100." },
        advice: { type: Type.STRING, description: "Critique of the composition in Japanese." }
      },
      required: ["score", "advice"]
    },
    lighting: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Score out of 100." },
        advice: { type: Type.STRING, description: "Critique of the lighting in Japanese." }
      },
      required: ["score", "advice"]
    },
    color: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Score out of 100." },
        advice: { type: Type.STRING, description: "Critique of the color grading in Japanese." }
      },
      required: ["score", "advice"]
    },
    pose: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Score out of 100." },
        advice: { type: Type.STRING, description: "Critique of the pose/placement of subjects in Japanese." }
      },
      required: ["score", "advice"]
    },
    costume: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Score out of 100." },
        advice: { type: Type.STRING, description: "Critique of the costume/outfit or styling in Japanese." }
      },
      required: ["score", "advice"]
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 key strengths of the photo in Japanese.",
    },
    improvements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 actionable improvements for next time in Japanese.",
    },
    technical_advice: {
      type: Type.STRING,
      description: "Specific technical advice regarding camera settings or post-processing in Japanese.",
    },
  },
  required: ["score", "title", "summary", "composition", "lighting", "color", "pose", "costume", "strengths", "improvements", "technical_advice"],
};

const getSystemPrompt = (mode: EvaluationMode): string => {
  const basePrompt = `
    あなたは世界的に有名なプロの写真家であり、写真コンテストの審査員です。
    提供された写真を分析し、建設的かつ専門的なフィードバックを提供してください。
    
    評価カテゴリ:
    1. 構図・コンポジション (Composition)
    2. 照明・ライティング (Lighting)
    3. 色彩・トーン (Color)
    4. 被写体のポーズ・立ち位置 (Pose & Placement)
       - 人物が写っている場合は、そのポーズ、表情、配置を評価。人物がいない場合は主被写体の配置。
    5. 衣装・スタイリング (Costume & Styling)
       - 人物: 服装、メイク、全体的な調和。静物/風景: 質感、装飾、ディテール。

    JSON形式で、必ず日本語で出力してください。
  `;

  switch (mode) {
    case EvaluationMode.SWEET:
      return `
        ${basePrompt}
        
        【重要：甘口モード】
        あなたは「褒めて伸ばす」タイプのとっても優しい先生です。
        - 採点基準：非常に甘く。多少の失敗には目をつぶり、良いところを過大評価するくらいでOKです。
        - 口調：優しく、親しみやすく、絵文字なども交えても構いません。
        - アドバイス：否定的な言葉は避け、「こうするともっと素敵になるよ！」というポジティブな提案をしてください。
        - 初心者が写真を好きになれるような、温かいフィードバックをお願いします。
      `;
    case EvaluationMode.SPICY:
      return `
        ${basePrompt}
        
        【重要：激辛モード（強めのアメとムチ）】
        あなたは妥協を許さない気難しい巨匠です。
        - 採点基準：非常に厳しく。プロレベルの基準で粗探しをしてください。80点以上は滅多に出さないでください。
        - 口調・態度：「強めのアメとムチ」。
          - ムチ：ダメな点、甘い考え、手抜きな構図などは容赦なく、少し厳しい口調（「〜したまえ」「〜だ」など）で指摘してください。
          - アメ：ただし、本当に光るセンスや素晴らしい要素があった場合は、ツンデレのように「悪くない」「見込みがある」「ここは認めてやろう」と熱く評価してください。
        - 中途半端な写真は徹底的に叩き、良い写真は（悔しがりながらも）認めるスタイルでお願いします。
      `;
    case EvaluationMode.MEDIUM:
    default:
      return `
        ${basePrompt}
        
        【中辛モード（標準）】
        あなたは信頼できるプロのメンターです。
        - 採点基準：公平かつ標準的。良い点は正当に評価し、改善点は率直に伝えてください。
        - 口調：丁寧で专业的（です・ます調）。
        - 感情に流されず、論理的で実践的なアドバイスを心がけてください。
      `;
  }
};

export const analyzePhoto = async (base64Image: string, mimeType: string, mode: EvaluationMode = EvaluationMode.MEDIUM): Promise<AnalysisResult> => {
  try {
    const systemInstruction = getSystemPrompt(mode);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: systemInstruction,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: mode === EvaluationMode.SPICY ? 0.7 : 0.4, // Spicy mode needs more creativity/personality
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini");
    }

    const result = JSON.parse(response.text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Error analyzing photo:", error);
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
