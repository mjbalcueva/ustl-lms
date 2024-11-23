import React, { Suspense } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { CopyButton } from '@/core/components/copy-button'
import { Copy } from '@/core/lib/icons'
import { cn } from '@/core/lib/utils/cn'

type MarkdownRendererProps = {
	children: string
}
export const MarkdownRenderer = ({ children }: MarkdownRendererProps) => {
	return (
		<Markdown remarkPlugins={[remarkGfm]} components={Components} className="space-y-3">
			{children}
		</Markdown>
	)
}

type HighlightedPreProps = React.HTMLAttributes<HTMLPreElement> & {
	children: string
	language: string
}

type ShikiToken = {
	content: string
	htmlStyle?: string | Record<string, string>
}

const shikiPromise = import('shiki').then((mod) => ({
	codeToTokens: mod.codeToTokens,
	bundledLanguages: mod.bundledLanguages
}))

const HighlightedPre = React.memo(({ children, language, ...props }: HighlightedPreProps) => {
	const [tokens, setTokens] = React.useState<ShikiToken[][]>([])

	React.useEffect(() => {
		let mounted = true

		void shikiPromise
			.then(({ codeToTokens, bundledLanguages }) => {
				if (!mounted) return
				if (!(language in bundledLanguages)) return

				return codeToTokens(children, {
					lang: language as keyof typeof bundledLanguages,
					defaultColor: false,
					themes: {
						light: 'github-light',
						dark: 'github-dark'
					}
				}).then((result) => {
					if (mounted) {
						setTokens(result.tokens)
					}
				})
			})
			.catch(console.error)

		return () => {
			mounted = false
		}
	}, [children, language])

	if (!tokens.length) {
		return <pre {...props}>{children}</pre>
	}

	return (
		<pre {...props}>
			<code>
				{tokens.map((line, lineIndex) => (
					<React.Fragment key={lineIndex}>
						<span>
							{line.map((token, tokenIndex) => {
								const style = typeof token.htmlStyle === 'string' ? undefined : token.htmlStyle

								return (
									<span
										key={tokenIndex}
										className="bg-shiki-light-bg text-shiki-light dark:bg-shiki-dark-bg dark:text-shiki-dark"
										style={style}
									>
										{token.content}
									</span>
								)
							})}
						</span>
						{lineIndex !== tokens.length - 1 && '\n'}
					</React.Fragment>
				))}
			</code>
		</pre>
	)
})
HighlightedPre.displayName = 'HighlightedCode'

type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
	children: React.ReactNode
	className?: string
	language: string
}
const CodeBlock = ({ children, className, language, ...restProps }: CodeBlockProps) => {
	const code = typeof children === 'string' ? children : childrenTakeAllStringContents({ children })

	const preClass = cn(
		'overflow-x-scroll rounded-md border bg-background/50 p-4 font-mono text-sm [scrollbar-width:none]',
		className
	)

	return (
		<div className="group/code relative mb-4">
			<Suspense
				fallback={
					<pre className={preClass} {...restProps}>
						{children}
					</pre>
				}
			>
				<HighlightedPre language={language} className={preClass}>
					{code}
				</HighlightedPre>
			</Suspense>

			<div className="invisible absolute right-2 top-2 flex space-x-1 rounded-lg p-1 opacity-0 transition-all duration-200 group-hover/code:visible group-hover/code:opacity-100">
				<CopyButton onCopy={() => navigator.clipboard.writeText(code)} icon={Copy} />
			</div>
		</div>
	)
}

type ChildrenTakeAllStringContentsProps = {
	children: React.ReactNode
}
const childrenTakeAllStringContents = ({
	children
}: ChildrenTakeAllStringContentsProps): string => {
	if (typeof children === 'string') {
		return children
	}

	if (React.isValidElement(children)) {
		const childContent = React.isValidElement(children)
			? (children.props as { children?: React.ReactNode }).children
			: undefined

		if (Array.isArray(childContent)) {
			return childContent
				.map((child: React.ReactNode) => childrenTakeAllStringContents({ children: child }))
				.join('')
		} else {
			return childrenTakeAllStringContents({ children: childContent })
		}
	}

	return ''
}

const withClass = (Tag: keyof JSX.IntrinsicElements, classes: string) => {
	const Component = ({ className, ...props }: JSX.IntrinsicElements[typeof Tag]) => (
		// @ts-expect-error - JSX element type inference limitation
		<Tag className={cn(classes, className)} {...props} />
	)
	Component.displayName = Tag
	return Component
}

type PreProps = React.HTMLAttributes<HTMLPreElement>

const Components = {
	h1: withClass('h1', 'text-2xl font-semibold'),
	h2: withClass('h2', 'font-semibold text-xl'),
	h3: withClass('h3', 'font-semibold text-lg'),
	h4: withClass('h4', 'font-semibold text-base'),
	h5: withClass('h5', 'font-medium'),
	strong: withClass('strong', 'font-black'),
	a: withClass('a', 'text-primary underline underline-offset-2'),
	blockquote: withClass('blockquote', 'border-l-2 border-primary pl-4'),
	code: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement>) => {
		const match = /language-(\w+)/.exec(className ?? '')
		return match ? (
			<CodeBlock {...rest} className={className} language={match[1] ?? ''}>
				{children}
			</CodeBlock>
		) : (
			<code
				className={cn(
					'font-mono [:not(pre)>&]:rounded-md [:not(pre)>&]:bg-background/50 [:not(pre)>&]:px-1 [:not(pre)>&]:py-0.5'
				)}
				{...rest}
			>
				{children}
			</code>
		)
	},
	pre: ({ children, ...props }: PreProps) => <pre {...props}>{children}</pre>,
	ol: withClass('ol', 'list-decimal pl-6 marker:text-sm'),
	ul: withClass('ul', 'list-disc pl-6 marker:text-sm'),
	li: withClass('li', 'my-1.5 text-sm'),
	table: withClass(
		'table',
		'w-full border-collapse overflow-y-auto rounded-md border border-foreground/20'
	),
	th: withClass(
		'th',
		'border border-foreground/20 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right'
	),
	td: withClass(
		'td',
		'border border-foreground/20 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right'
	),
	tr: withClass('tr', 'm-0 border-t p-0 even:bg-muted'),
	p: withClass('p', 'whitespace-pre-wrap text-sm'),
	hr: withClass('hr', 'border-foreground/20')
}
