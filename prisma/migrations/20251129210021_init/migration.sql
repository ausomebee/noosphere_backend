-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_primaryPayer_fkey" FOREIGN KEY ("primaryPayer") REFERENCES "Payer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
