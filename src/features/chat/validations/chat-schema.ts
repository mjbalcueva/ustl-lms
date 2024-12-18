import { z } from 'zod'

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------
//

// SendMessage
export const sendMessageSchema = z.object({
	conversationId: z.string(),
	type: z.enum(['direct', 'group']),
	content: z.string().min(1)
})

// ---------------------------------------------------------------------------
// READ
// ---------------------------------------------------------------------------
//

// GetConversationMessages
export const getConversationMessagesSchema = z.object({
	conversationId: z.string(),
	type: z.enum(['direct', 'group'])
})

export type GetConversationMessagesSchema = z.infer<
	typeof getConversationMessagesSchema
>

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------
//

// MarkChatAsRead
export const markChatAsReadSchema = z.object({
	chatId: z.string(),
	type: z.enum(['direct', 'group'])
})
