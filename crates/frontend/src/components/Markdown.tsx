import { invoke } from "@tauri-apps/api/tauri";
import styled from "@emotion/styled";
import rangeParser from 'parse-numeric-range';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useState } from "react";
import ReactMarkdown from 'react-markdown'
import remarkBreaks from "remark-breaks";

type MarkdownProps = {
    content?: string;
    options?: any;
};

const ReactMarkdownContainer = styled.div`
pre{
    white-space: initial;
}
.linenumber { display: none!important; }
.codeStyle{
    margin-top:0!important;
    border-radius: 0 0 .3em .3em!important;
}
`

const SyntaxHeader = styled.div`
    background: #1C1D28;
    margin-top:0.5em;
    padding:.4em;
    text-align: right;
    border-radius: .3em .3em 0 0px;
    display: flex;
    justify-content: space-between;

    a{
        text-decoration: none;
        color: #fff; 
    }
`

export default function Markdown({ content, options }: MarkdownProps) {

    const [copied, setCopied] = useState(false)

    const syntaxTheme = oneDark;

    const MarkdownComponents: object = {
        a: ({ node, ...props }: any) => {
            if (!props.href?.length) return "ok";
            return <a onClick={() => {
                let url;
                try {
                    url = new URL(props.href)
                }
                catch {
                }
                if (url) {
                    invoke("open_link_in_browser", { url: props.href })
                    invoke("hide")
                }
            }}>{props.children}</a>
        },
        code({ node, inline, className, ...props }: any) {
            const hasLang = /language-(\w+)/.exec(className || '');
            const hasMeta = node?.data?.meta;

            const applyHighlights: object = (applyHighlights: number) => {
                if (hasMeta) {
                    const regex = /{([\d,-]+)}/;
                    const metadata = node.data.meta?.replace(/\s/g, '');
                    const strlineNumbers = regex?.test(metadata)
                        ? regex?.exec(metadata)![1]
                        : '0';
                    const highlightLines = rangeParser(strlineNumbers);
                    const highlight = highlightLines;
                    const data: string | null = highlight.includes(applyHighlights)
                        ? 'highlight'
                        : null;
                    return { data };
                } else {
                    return {};
                }
            };

            return hasLang ? (
                <>
                    <SyntaxHeader>
                        <div>
                            {hasLang[1]}
                        </div>
                        <a onClick={() => {

                            setCopied(true)
                            navigator.clipboard.writeText(props.children)
                            setTimeout(() => {
                                setCopied(false)
                            }, 1000)

                        }}>
                            {copied ? "Copied!" : "Copy"}
                        </a>
                    </SyntaxHeader>
                    <SyntaxHighlighter
                        style={syntaxTheme}
                        language={hasLang[1]}
                        PreTag="div"
                        className="codeStyle"
                        showLineNumbers={true}
                        wrapLines={hasMeta}
                        useInlineStyles={true}
                        lineProps={applyHighlights}
                    >
                        {props.children}
                    </SyntaxHighlighter>
                </>
            ) : (
                <code className={className} {...props} />
            )
        },
    }



    return (

        <ReactMarkdownContainer>
            <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkBreaks]}
                {...options}
            >
                {content || ""}
            </ReactMarkdown>

        </ReactMarkdownContainer >
    );
};


