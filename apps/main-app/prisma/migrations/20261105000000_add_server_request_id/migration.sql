ALTER TABLE "ServerRequest" ADD COLUMN "requestId" TEXT;

CREATE INDEX "ServerRequest_requestId_idx" ON "ServerRequest"("requestId");
