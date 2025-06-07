import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isTranscribing: boolean;
  setIsTranscribing: (transcribing: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => {
        console.log('Setting chat state to:', isOpen);
        set({ isOpen });
      },
      isRecording: false,
      setIsRecording: (recording) => {
        console.log('Setting recording state to:', recording);
        set({ isRecording: recording });
      },
      isTranscribing: false,
      setIsTranscribing: (transcribing) => {
        console.log('Setting transcribing state to:', transcribing);
        set({ isTranscribing: transcribing });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ isOpen: state.isOpen }), // Only persist isOpen state
    }
  )
); 