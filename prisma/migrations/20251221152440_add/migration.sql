-- CreateEnum
CREATE TYPE "OnsiteRequestLogAction" AS ENUM ('CREATED', 'STATUS_CHANGED', 'ITEMS_UPDATED', 'ADDRESS_UPDATED', 'SCHEDULE_CHANGED', 'CANCELLED');

-- CreateTable
CREATE TABLE "OnsiteRequestLog" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "action" "OnsiteRequestLogAction" NOT NULL,
    "oldStatus" "OnsideStatus",
    "newStatus" "OnsideStatus",
    "changedById" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnsiteRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OnsiteRequestLog_requestId_idx" ON "OnsiteRequestLog"("requestId");

-- CreateIndex
CREATE INDEX "OnsiteRequestLog_changedById_idx" ON "OnsiteRequestLog"("changedById");

-- CreateIndex
CREATE INDEX "OnsiteRequestLog_action_idx" ON "OnsiteRequestLog"("action");

-- CreateIndex
CREATE INDEX "OnsiteRequestLog_timestamp_idx" ON "OnsiteRequestLog"("timestamp");

-- AddForeignKey
ALTER TABLE "OnsiteRequestLog" ADD CONSTRAINT "OnsiteRequestLog_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "OnsiteRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnsiteRequestLog" ADD CONSTRAINT "OnsiteRequestLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
