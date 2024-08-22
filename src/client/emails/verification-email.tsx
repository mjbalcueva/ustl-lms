import {
	Body,
	Button,
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

interface VerificationEmailProps {
	email?: string
	confirmLink?: string
}

export const VerificationEmail = ({ email, confirmLink }: VerificationEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Confirm your email</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-neutral-100 font-sans text-black">
					<Container className="rounded border border-solid border-[#eaeaea] bg-white px-10 pb-10">
						<Heading className="flex items-center justify-start gap-4">Scholar</Heading>
						<Hr />
						<Section>
							<Text>
								Hi there <strong>{email}</strong>!
							</Text>
							<Text>
								Thank you for signing up! We want to make sure it&apos;s really you. Please{' '}
								<strong>confirm your email</strong> by clicking the button below:
							</Text>
							<Button
								href={confirmLink}
								className="rounded bg-[#000000] px-14 py-3 text-center text-xs font-semibold tracking-wide text-white no-underline"
							>
								Confirm Email
							</Button>
							<Text>
								If you did not sign up for this account, please ignore this email or contact support at{' '}
								<Link href="mailto:support@ustl-lms.tech" className="text-blue-600 no-underline">
									support@ustl-lms.tech
								</Link>
								.
							</Text>
							<Text>To keep your account secure, please do not forward this email to anyone.</Text>
							<Text>Happy Learning!</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}

VerificationEmail.PreviewProps = {
	email: 'sample.email@ustl-legazpi.edu.ph',
	confirmLink: '123456'
} as VerificationEmailProps

export default VerificationEmail
