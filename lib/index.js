"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remarkShiki = void 0;
const shiki_1 = require("shiki");
const unist_util_visit_1 = __importDefault(require("unist-util-visit"));
const blockClassName = 'shiki';
const inlineClassName = 'shiki-inline';
const errorHtml = '<code>ERROR Rendering Code Block</code>';
function highlight(code, highlighter) {
    const html = highlighter.codeToHtml(code.value, code.lang);
    return `<div class="gatsby-highlight" data-language="${code.lang}">${html}</div>`;
}
function isLanguageSupported(lang) {
    if (!lang)
        return false;
    return shiki_1.BUNDLED_LANGUAGES.find(l => { var _a; return l.id === lang || ((_a = l.aliases) === null || _a === void 0 ? void 0 : _a.includes(lang)); }) != undefined;
}
const remarkShiki = function (options) {
    const opts = Object.assign({ theme: "light_plus", semantic: false, skipInline: true }, options);
    return (root) => __awaiter(this, void 0, void 0, function* () {
        const highlighter = yield shiki_1.getHighlighter({
            theme: opts.theme
        });
        function highlightCode(code) {
            let value = "";
            try {
                value = highlight(code, highlighter);
            }
            catch (e) {
                console.log(e);
            }
            return value.replace('<code>', `<code class="language-${code.lang}">`);
        }
        function highlighInlineCode(code) {
            let value = "";
            try {
                value = highlight(code, highlighter);
            }
            catch (e) {
                console.log(e);
            }
            return value;
        }
        function transform(tag, highlightFunc) {
            unist_util_visit_1.default(root, tag, (code, _, parent) => {
                // Skip if the languaged is not supported
                if (!isLanguageSupported(code.lang))
                    return "skip";
                const html = {
                    type: 'html',
                    value: highlightFunc(code)
                };
                for (let i = 0; i < parent.children.length; ++i) {
                    if (parent.children[i] == code) {
                        parent.children[i] = html;
                        break;
                    }
                }
                return 'skip';
            });
        }
        transform('code', highlightCode);
        if (!opts.skipInline)
            transform('inlineCode', highlighInlineCode);
    });
};
exports.remarkShiki = remarkShiki;
//# sourceMappingURL=index.js.map