import { TRPCClientError } from '@trpc/client';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const chatRouter = createTRPCRouter({
  
  // Get List of Chats (For both Instructor and Student)
  getChats: protectedProcedure.query(async ({ ctx }) => {
    // Determine if the current user is an instructor or student
    const userId = ctx.session.user.id;

    let chats;
    
    // If the current user is an instructor, we filter for group chats
    if (ctx.session.user.role === 'INSTRUCTOR') {
      // Fetch group chats that the instructor is part of
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
          course: true,  // Include related course information
          messages: true,  // Include all messages in the group chat
          enrollments: true,  // Include enrollments for the course
          _count: {
            select: {
              messages: true,  // Count messages in the chat
              enrollments: true, // Count enrollments in the group chat
            }
          }
        }
      });
    } else {
      // If the current user is a student, fetch all group chats they are part of
      chats = await ctx.db.groupChat.findMany({
        where: {
          enrollments: {
            some: {
              userId: userId
            }
          }
        },
        include: {
          course: true, // Include related course information
          messages: true,  // Include all messages in the group chat
          enrollments: true,  // Include enrollments for the course
          _count: {
            select: {
              messages: true, // Count messages in the chat
              enrollments: true, // Count students in the group chat
            }
          }
        }
      });
    }
    
    return chats;  // Return the list of chats for the instructor or student
  }),
});
