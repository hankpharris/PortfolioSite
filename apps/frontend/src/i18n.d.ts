module "i18n" {
    interface TranslateStore {
        translations: Record<string, string>;
        language: string;
    }

    export const useTranslateStore: import("zustand").UseBoundStore<
        import("zustand").StoreApi<TranslateStore>
    >;
    /**
     * Use `useTranslate` when possible... Otherwise, use this function
     */
    export function useTranslateStateless(): (
        strings: TemplateStringsArray,
        ...values: unknown[]
    ) => string;
    /**
     * This is a component hook like useState. Must be used in a component.
     */
    export function useTranslate(): (strings: TemplateStringsArray, ...values: unknown[]) => string;
    export function useLanguage(): string;
}
