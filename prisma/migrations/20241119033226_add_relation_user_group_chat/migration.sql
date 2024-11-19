-- CreateTable
CREATE TABLE "_UserGroupChats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserGroupChats_AB_unique" ON "_UserGroupChats"("A", "B");

-- CreateIndex
CREATE INDEX "_UserGroupChats_B_index" ON "_UserGroupChats"("B");

-- AddForeignKey
ALTER TABLE "_UserGroupChats" ADD CONSTRAINT "_UserGroupChats_A_fkey" FOREIGN KEY ("A") REFERENCES "group_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroupChats" ADD CONSTRAINT "_UserGroupChats_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
