import { Request, Response, NextFunction } from 'express';
import { OpenAIResponse } from '../services/chatAI.Service';
const openAIEndpoint: (req: Request, res: Response, next: NextFunction) => Promise<void> = async (req, res, next) => {
    try {
        const query = req.body.chatQuery as string ;
        const model = req.body.openAiModel as string || 'gpt-4o';
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ status: "false", error: "API key is missing", data: null });
            return;
        }
        const response = await OpenAIResponse(query, model, apiKey);
        res.status(200).json({ status: "success", data: response, error: null });
    } catch (error) {
        res.status(500).json({
            status: "false",
            data: null,
            error: error instanceof Error ? error.message : "An error occurred"
        });
    }
};
export { openAIEndpoint };