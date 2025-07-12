
'use client';

import type React from 'react';

// This component is not used in the current text-first version of the application.
// It's kept as a placeholder. If voice cloning is re-introduced, this component
// would need to be updated and re-integrated.

interface VoiceCloningSectionProps {
  onVoiceCloned: (voiceCloneId: string, name: string, audioSrc: string | null) => void;
}

const VoiceCloningSection: React.FC<VoiceCloningSectionProps> = () => {
  return null; // Render nothing as this section is removed from the flow
};

export default VoiceCloningSection;
