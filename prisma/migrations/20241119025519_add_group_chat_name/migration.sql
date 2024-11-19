/*
  Warnings:

  - Added the required column `name` to the `group_chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "group_chat" ADD COLUMN     "name" TEXT NOT NULL;
