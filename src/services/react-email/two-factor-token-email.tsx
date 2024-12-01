import {
	Body,
	CodeInline,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components'

type TwoFactorTokenEmailProps = {
	email?: string
	token?: string
}

export const TwoFactorTokenEmail = ({
	email,
	token
}: TwoFactorTokenEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Two Factor Authentication Code</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-neutral-100 py-6 font-sans text-neutral-950">
					<Container className="rounded-xl border border-solid border-[#eaeaea] bg-white px-10 pb-10">
						<Heading className="flex items-center justify-start gap-4">
							Scholar
						</Heading>
						<Hr />
						<Section>
							<Text>
								Hi there <strong>{email}</strong>!
							</Text>
							<Text>
								You are receiving this email because you are attempting to sign
								in to your account using{' '}
								<strong>two-factor authentication</strong>. Please enter the
								following code in your browser to complete the sign-in process:
							</Text>
							<Section>
								<CodeInline className="bg-neutral-200/50 px-14 text-3xl font-semibold tracking-widest text-neutral-950">
									{token}
								</CodeInline>
							</Section>
							<Text>
								If you did not request this code, please ignore this email or
								contact support at{' '}
								<Link
									href="mailto:support@ustl-lms.tech"
									className="text-blue-600 no-underline"
								>
									support@ustl-lms.tech
								</Link>
								.
							</Text>
							<Text>
								To keep your account secure, please do not share this code with
								anyone.
							</Text>
							<Text>Happy Learning!</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

TwoFactorTokenEmail.PreviewProps = {
	email: 'sample.email@ustl-legazpi.edu.ph',
	token: '123456'
} as TwoFactorTokenEmailProps
