export default function Page({ params }: { params: { token: string } }) {
	const { token } = params

	return (
		<div className="flex h-full items-center justify-center">
			<h1>Enroll Page</h1>
			<pre>{token}</pre>
		</div>
	)
}
