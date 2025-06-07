import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isSTTEnabled: boolean;
  setIsSTTEnabled: (enabled: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => {
        console.log('Setting chat state to:', isOpen);
        set({ isOpen });
      },
      isSTTEnabled: false,
      setIsSTTEnabled: (enabled) => {
        console.log('Setting STT state to:', enabled);
        set({ isSTTEnabled: enabled });
      },
      isRecording: false,
      setIsRecording: (recording) => {
        console.log('Setting recording state to:', recording);
        set({ isRecording: recording });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
); 