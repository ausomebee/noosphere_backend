-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_assignToAdmin_fkey" FOREIGN KEY ("assignToAdmin") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
