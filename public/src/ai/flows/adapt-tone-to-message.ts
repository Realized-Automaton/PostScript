// src/ai/flows/adapt-tone-to-message.ts
'use server';
/**
 * @fileOverview Adapts the tone of the AI's voice to match the message content, making the AI sound more like the person it is emulating.
 *
 * - adaptToneToMessage - A function that adjusts the tone of a given text message.
 * - AdaptToneToMessageInput - The input type for the adaptToneToMessage function.
 * - AdaptToneToMessageOutput - The return type for the adaptToneToMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptToneToMessageInputSchema = z.object({
  message: z.string().describe('The text message to be spoken by the AI.'),
  personalityProfile: z
    .string()
    .describe(
      'A description of the personality of the person the AI is emulating.'
    ),
});
export type AdaptToneToMessageInput = z.infer<typeof AdaptToneToMessageInputSchema>;

const AdaptToneToMessageOutputSchema = z.object({
  adjustedMessage: z
    .string()
    .describe(
      'The text message adjusted to reflect the appropriate tone based on the personality profile.'
    ),
});
export type AdaptToneToMessageOutput = z.infer<typeof AdaptToneToMessageOutputSchema>;

export async function adaptToneToMessage(
  input: AdaptToneToMessageInput
): Promise<AdaptToneToMessageOutput> {
  return adaptToneToMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptToneToMessagePrompt',
  input: {schema: AdaptToneToMessageInputSchema},
  output: {schema: AdaptToneToMessageOutputSchema},
  prompt: `You are an AI that adjusts the tone of a message to match a given personality profile.

Given the following message and personality profile, adjust the message to reflect the appropriate tone.

Message: {{{message}}}
Personality Profile: {{{personalityProfile}}}

Adjusted Message:`, // Removed the code example here
});

const adaptToneToMessageFlow = ai.defineFlow(
  {
    name: 'adaptToneToMessageFlow',
    inputSchema: AdaptToneToMessageInputSchema,
    outputSchema: AdaptToneToMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
