// src/ai/flows/personalize-chat-responses.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for personalizing chat responses based on a provided personality profile.
 *
 * - personalizeChatResponse - A function that takes chat input and a personality profile to generate a personalized response.
 * - PersonalizeChatResponseInput - The input type for the personalizeChatResponse function.
 * - PersonalizeChatResponseOutput - The return type for the personalizeChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeChatResponseInputSchema = z.object({
  chatInput: z.string().describe('The user input to the chat bot.'),
  personalityProfile: z
    .string()
    .describe(
      'A detailed description of the personality to be emulated in the chat response.'
    ),
});
export type PersonalizeChatResponseInput = z.infer<typeof PersonalizeChatResponseInputSchema>;

const PersonalizeChatResponseOutputSchema = z.object({
  personalizedResponse: z
    .string()
    .describe('The chat bot response, personalized to match the provided profile.'),
});
export type PersonalizeChatResponseOutput = z.infer<typeof PersonalizeChatResponseOutputSchema>;

export async function personalizeChatResponse(
  input: PersonalizeChatResponseInput
): Promise<PersonalizeChatResponseOutput> {
  return personalizeChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeChatResponsePrompt',
  input: {schema: PersonalizeChatResponseInputSchema},
  output: {schema: PersonalizeChatResponseOutputSchema},
  prompt: `You are a highly advanced AI chatbot designed to emulate the personality of a specific person for a user who misses them. Your goal is to provide a comforting and authentic conversational experience.

You have been given a detailed personality profile. Use this profile to guide your responses, but do not be a robot. The key is to be natural and subtle.

Here is the profile:
{{{personalityProfile}}}

**Your Core Instructions:**

1.  **Adopt the Core Personality:** Embody the described traits, demeanor, and emotional tone. If the profile says they were funny, be funny. If they were quiet and thoughtful, reflect that. This is your primary guide.
2.  **Use Phrases Naturally:** The profile may contain common phrases or sayings. DO NOT repeat these in every message. Use them sparingly, only when they fit the context perfectly, to add a touch of authenticity. Overusing them will break the illusion.
3.  **Reference Memories and Interests Subtly:** The profile might list interests, hobbies, or memories. Use this knowledge to inform your side of the conversation. For example, if they loved gardening, you might mention how peaceful a garden is, but do not say "I remember loving gardening." You are embodying them, not narrating their life.
4.  **Prioritize a Natural Conversation:** Your main goal is to respond to the user's input in a realistic, human-like way. Do not just recite facts from the profile.

Now, respond to the following user input based on these instructions.

User Input: {{{chatInput}}}
`,
});

const personalizeChatResponseFlow = ai.defineFlow(
  {
    name: 'personalizeChatResponseFlow',
    inputSchema: PersonalizeChatResponseInputSchema,
    outputSchema: PersonalizeChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
