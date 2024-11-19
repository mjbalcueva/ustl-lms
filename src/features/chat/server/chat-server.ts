import { z } from 'zod';  // Ensure zod is imported
import { TRPCClientError } from '@trpc/client';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const chatRouter = createTRPCRouter({
  
  // Get List of Chats (For both Instructor and Student)
  getChats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    let chats;

    // If the current user is an instructor, we filter for group chats
    if (ctx.session.user.role === 'INSTRUCTOR') {
      chats = await ctx.db.groupChat.findMany({
        where: { 
          courseId: { 
            in: await ctx.db.course.findMany({
              where: { instructorId: userId },
              select: { id: true }
            }).then(courses => courses.map(course => course.id))
          }
        },
        include: {
          course: true,
          messages: true,
          enrollments: true,
          _count: {
            select: {
              messages: true,
              enrollments: true,
            }
          }
        }
      });
    } else {
      chats = await ctx.db.groupChat.findMany({
        where: {
          enrollments: {
            some: {
              userId: userId
            }
          }
        },
        include: {
          course: true,
          messages: true,
          enrollments: true,
          _count: {
            select: {
              messages: true,
              enrollments: true,
            }
          }
        }
      });
    }

    return chats;
  }),

  // Find one chat by ID
  findOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      // Fetch the chat by its ID
      const chat = await ctx.db.groupChat.findUnique({
        where: {
          id: input.id
        },
        include: {
          course: true,
          messages: true,
          enrollments: true,
          _count: {
            select: {
              messages: true,
              enrollments: true,
            }
          }
        }
      });

      // If no chat is found, throw an error
      if (!chat) {
        throw new TRPCClientError('Chat not found');
      }

      return chat;
    } catch (error) {
      throw new TRPCClientError('Error fetching chat');
    }
  })
});
