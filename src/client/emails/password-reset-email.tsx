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

interface PasswordEmailProps {
	email?: string
	resetLink?: string
}

export const PasswordResetEmail = ({ email, resetLink }: PasswordEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Reset your password</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-neutral-100 py-6 font-sans text-black">
					<Container className="rounded-xl border border-solid border-[#eaeaea] bg-white px-10 pb-10">
						<Heading className="flex items-center justify-start gap-4">Scholar</Heading>
						<Hr />
						<Section>
							<Text>
								Hi there <strong>{email}</strong>!
							</Text>
							<Text>
								Someone recently requested a <strong>password change</strong> for your for your Scholar account. If this
								was you, you can set a new password by clicking the button below:
							</Text>
							<Button
								href={resetLink}
								className="rounded bg-[#000000] px-14 py-3 text-center text-xs font-semibold tracking-wide text-white no-underline"
							>
								Reset Password
							</Button>
							<Text>
								If you do not want to change your password, please ignore this email or contact support at{' '}
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

PasswordResetEmail.PreviewProps = {
	email: 'sample.email@ustl-legazpi.edu.ph',
	resetLink: '123456'
} as PasswordEmailProps

export default PasswordResetEmail
