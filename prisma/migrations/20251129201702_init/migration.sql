-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_payer_fkey" FOREIGN KEY ("payer") REFERENCES "Payer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
