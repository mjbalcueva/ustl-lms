export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
	return <div className="grid h-full min-h-[650px] place-items-center bg-background">{children}</div>
}
