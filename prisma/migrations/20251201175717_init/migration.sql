-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_insuranceType_fkey" FOREIGN KEY ("insuranceType") REFERENCES "InsuranceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
