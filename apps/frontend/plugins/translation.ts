import { Plugin } from "vite";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { generate } from "@babel/generator";
import * as t from "@babel/types";
import path from "path";
import fs from "fs/promises";

const i18n = `

import { create } from "zustand";
import defaultTranslation from "@/translations/en.json";

export const useTranslateStore = create(set => ({
    translations: defaultTranslation,
    language: "en",
}));

export function useTranslateStateless() {
    return useTranslateStore.getState().translations;
}

export function useTranslate() {
    return useTranslateStore(state => state.translations);
}                           

export function useLanguage() {
    return useTranslateStore(state => state.language);
}
`;

export default function translatePlugin(): Plugin {
    const outputPath = path.resolve("src/translations/en.json");
    const translationsSet: Set<string> = new Set();
    const translations: [string, string][] = [];

    const virtualModuleId = "virtual:i18n";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    return {
        name: "vite-plugin-static-translate",
        enforce: "pre",
        resolveId(id) {
            if (id === "i18n") {
                return resolvedVirtualModuleId;
            }
            return null;
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return i18n;
            }
            return null;
        },
        transform(code: string, id: string) {
            if (!id.endsWith(".ts") && !id.endsWith(".tsx")) return;

            const ast = parse(code, {
                sourceType: "module",
                plugins: ["typescript", "jsx"],
            });

            (traverse as unknown as { default: typeof traverse }).default(ast, {
                TaggedTemplateExpression(path) {
                    const tag = path.node.tag;
                    if (!t.isIdentifier(tag, { name: "t" })) return;

                    const quasi = path.node.quasi;
                    if (quasi.expressions.length > 0) {
                        throw path.buildCodeFrameError(
                            "interpolations (${...}) are not allowed inside t``."
                        );
                    }

                    const raw = quasi.quasis.map(q => q.value.cooked).join("");
                    const filtered = raw.replace(/\s*\[[^\]]*\]\s*/g, "");

                    if (!translationsSet.has(raw)) {
                        translationsSet.add(raw);
                        translations.push([raw, filtered]);
                    }

                    path.replaceWith(
                        t.logicalExpression(
                            "??",
                            t.memberExpression(t.identifier("t"), t.stringLiteral(raw), true),
                            t.stringLiteral(filtered)
                        )
                    );
                },
            });

            const output = generate(ast, {}, code);
            return {
                code: output.code,
                map: null,
            };
        },
        async closeBundle() {
            const output = JSON.stringify(
                Object.fromEntries(translations.sort(([a], [b]) => a.localeCompare(b))),
                null,
                4
            );

            console.log(`[plugin:vite-plugin-static-translate] writing to ${outputPath}`);

            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, output);

            this.emitFile({
                type: "asset",
                fileName: "src/translations/en.json",
                source: output,
            });

            await checkIntegrity();
        },
    };
}

async function checkIntegrity() {
    const translationsDir = path.resolve("src/translations");
    const enPath = path.join(translationsDir, "en.json");

    const en = JSON.parse(await fs.readFile(enPath, "utf-8"));
    const enKeys = new Set(Object.keys(en));

    const files = (await fs.readdir(translationsDir)).filter(
        file => file.endsWith(".json") && file !== "en.json"
    );

    let hasErrors = false;

    for (const file of files) {
        const filePath = path.join(translationsDir, file);
        const lang = path.basename(file, ".json");
        const langData = JSON.parse(await fs.readFile(filePath, "utf-8"));
        const langKeys = new Set(Object.keys(langData));

        // @ts-expect-error target ES2015 or higher for Set<T>
        const missingKeys = [...enKeys].filter(key => !langKeys.has(key));

        // @ts-expect-error target ES2015 or higher for Set<T>
        const extraKeys = [...langKeys].filter(key => !enKeys.has(key));

        for (const key of extraKeys) {
            delete langData[key];
        }

        if (missingKeys.length > 0) {
            hasErrors = true;
            console.log(`\nMissing keys in ${lang}.json:`);
            for (const key of missingKeys) {
                console.log(`"${key}": "${en[key]}",`);
            }
        }

        const output = JSON.stringify(langData, null, 4);
        await fs.writeFile(filePath, output);
    }

    if (hasErrors) {
        console.log(
            "\nTranslate these according to the language in the file name. Leave everything in braces in tact. Square brackets should be interpreted as purely translation notes and should be included in keys/untranslated but not values/the translation."
        );
    }
}
