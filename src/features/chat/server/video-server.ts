import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const videoChatRouter = createTRPCRouter({
  // Send WebRTC offer to the target user
  sendOffer: publicProcedure
    .input(
      z.object({
        targetUserId: z.string(), // ID of the user to whom the offer is sent
        offer: z.any(),          // WebRTC offer object
      })
    )
    .mutation(({ input, ctx }) => {
      const { targetUserId, offer } = input;

      // Emit the offer to the target user via Socket.IO
      ctx.socket?.to(targetUserId).emit('videoChat:offer', {
        offer,
        from: ctx.session?.user.id,
      });

      return { success: true };
    }),

  // Send WebRTC answer to the target user
  sendAnswer: publicProcedure
    .input(
      z.object({
        targetUserId: z.string(), // ID of the user to whom the answer is sent
        answer: z.any(),          // WebRTC answer object
      })
    )
    .mutation(({ input, ctx }) => {
      const { targetUserId, answer } = input;

      // Emit the answer to the target user via Socket.IO
      ctx.socket?.to(targetUserId).emit('videoChat:answer', {
        answer,
        from: ctx.session?.user.id,
      });

      return { success: true };
    }),

  // Send ICE candidate to the target user
  sendIceCandidate: publicProcedure
    .input(
      z.object({
        targetUserId: z.string(), // ID of the user to whom the ICE candidate is sent
        candidate: z.any(),       // ICE candidate object
      })
    )
    .mutation(({ input, ctx }) => {
      const { targetUserId, candidate } = input;

      // Emit the ICE candidate to the target user via Socket.IO
      ctx.socket?.to(targetUserId).emit('videoChat:candidate', {
        candidate,
        from: ctx.session?.user.id,
      });

      return { success: true };
    }),
});
