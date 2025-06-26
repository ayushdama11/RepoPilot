-- DropForeignKey
ALTER TABLE "UserToProject" DROP CONSTRAINT "UserToProject_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserToProject" ADD CONSTRAINT "UserToProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
