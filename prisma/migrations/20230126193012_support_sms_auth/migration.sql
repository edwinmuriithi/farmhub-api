-- CreateTable
CREATE TABLE "SmsAuth" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SmsAuth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SmsAuth" ADD CONSTRAINT "SmsAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
