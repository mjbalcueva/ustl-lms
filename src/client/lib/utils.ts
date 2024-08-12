import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
	return name
		.split(' ')
		.filter((n) => n)
		.map((n) => n[0])
		.join('')
		.substring(0, 2)
}

// func getEmail, returns everything before the @
export function getEmail(email: string) {
	return email.split('@')[0]
}
