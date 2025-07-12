
'use server';

/**
 * @fileOverview Voice clone creation flow. (This flow is currently not used as the app focuses on text-based interaction)
 *
 * - createVoiceClone - A function that handles the voice clone creation process.
 * - CreateVoiceCloneInput - The input type for the createVoiceClone function.
 * - CreateVoiceCloneOutput - The return type for the createVoiceClone function.
 */

import {z} from 'genkit';

const CreateVoiceCloneInputSchema = z.object({
  audioDataUri: z
    .string()
    .optional()
    .describe(
      "Audio samples of the person to be cloned, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  name: z.string().describe('The name of the person being cloned.'),
});
export type CreateVoiceCloneInput = z.infer<typeof CreateVoiceCloneInputSchema>;

const CreateVoiceCloneOutputSchema = z.object({
  voiceCloneId: z.string().optional().describe('The ID of the created voice clone.'),
  message: z.string().describe('Confirmation message or status.'),
});
export type CreateVoiceCloneOutput = z.infer<typeof CreateVoiceCloneOutputSchema>;

export async function createVoiceClone(input: CreateVoiceCloneInput): Promise<CreateVoiceCloneOutput> {
  // This flow is not actively used in the text-first version of the application.
  // Returning a placeholder response.
  console.warn('createVoiceClone flow called, but voice cloning is not currently active in the UI.');
  return {
    voiceCloneId: `dummy-voice-clone-${input.name}-${Math.random().toString(36).substring(7)}`,
    message: `Voice cloning for ${input.name} is not currently integrated with the UI. Placeholder ID generated.`,
  };
}

// Removed ai.definePrompt and ai.defineFlow as this flow is dormant.
// If re-activating voice cloning, these would need to be restored and potentially updated.
