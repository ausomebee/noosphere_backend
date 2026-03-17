-- AlterTable
ALTER TABLE "PipelineStage" ADD COLUMN     "requiredDocuments" JSONB,
ADD COLUMN     "requiredTasks" JSONB;

-- CreateTable
CREATE TABLE "PipelineDoneTask" (
    "id" TEXT NOT NULL,
    "pipelineItemId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineDoneTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineSubmittedDocument" (
    "id" TEXT NOT NULL,
    "pipelineItemId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineSubmittedDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PipelineDoneTask" ADD CONSTRAINT "PipelineDoneTask_pipelineItemId_fkey" FOREIGN KEY ("pipelineItemId") REFERENCES "PipelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineSubmittedDocument" ADD CONSTRAINT "PipelineSubmittedDocument_pipelineItemId_fkey" FOREIGN KEY ("pipelineItemId") REFERENCES "PipelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
