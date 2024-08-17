// import Link from 'next/link'

import { api, HydrateClient } from '@/shared/trpc/server'

// import { LatestPost } from '@/client/components/post'

export default async function Page() {
	// const hello = await api.post.hello({ text: 'from tRPC' })

	void api.post.getLatest.prefetch()

	return (
		<HydrateClient>
			<main className="flex flex-auto flex-col overflow-y-auto border-border bg-background shadow-inner md:rounded-xl md:border">
				{/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
					<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
						Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
					</h1>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
						<Link
							className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
							href="https://create.t3.gg/en/usage/first-steps"
							target="_blank"
						>
							<h3 className="text-2xl font-bold">First Steps →</h3>
							<div className="text-lg">
								Just the basics - Everything you need to know to set up your database and authentication.
							</div>
						</Link>
						<Link
							className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
							href="https://create.t3.gg/en/introduction"
							target="_blank"
						>
							<h3 className="text-2xl font-bold">Documentation →</h3>
							<div className="text-lg">
								Learn more about Create T3 App, the libraries it uses, and how to deploy it.
							</div>
						</Link>
					</div>
					<div className="flex flex-col items-center gap-2">
						<p className="text-2xl text-white">{hello ? hello.greeting : 'Loading tRPC query...'}</p>
					</div>
					<LatestPost />
				</div> */}
			</main>
		</HydrateClient>
	)
}
