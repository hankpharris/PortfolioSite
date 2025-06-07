import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => {
        console.log('Setting chat state to:', isOpen);
        set({ isOpen });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
); 