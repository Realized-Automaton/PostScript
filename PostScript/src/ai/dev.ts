
import { config } from 'dotenv';
config();

// import '@/ai/flows/create-voice-clone.ts'; // Voice cloning removed for now
import '@/ai/flows/adapt-tone-to-message.ts';
import '@/ai/flows/personalize-chat-responses.ts';
import '@/ai/flows/email-conversation-flow.ts'; // Added new flow
import '@/ai/flows/text-to-speech-flow.ts';
