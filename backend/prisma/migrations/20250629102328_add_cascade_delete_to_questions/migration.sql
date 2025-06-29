-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_userId_fkey";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
