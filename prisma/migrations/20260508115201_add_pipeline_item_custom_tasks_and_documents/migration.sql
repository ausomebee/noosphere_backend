-- CreateTable
CREATE TABLE "PipelineItemCustomTask" (
    "id" TEXT NOT NULL,
    "pipelineItemId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineItemCustomTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PipelineItemCustomDocument" (
    "id" TEXT NOT NULL,
    "pipelineItemId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "fileUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineItemCustomDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PipelineItemCustomTask" ADD CONSTRAINT "PipelineItemCustomTask_pipelineItemId_fkey" FOREIGN KEY ("pipelineItemId") REFERENCES "PipelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PipelineItemCustomDocument" ADD CONSTRAINT "PipelineItemCustomDocument_pipelineItemId_fkey" FOREIGN KEY ("pipelineItemId") REFERENCES "PipelineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
