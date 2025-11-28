-- AlterTable
ALTER TABLE "ClientAuthorization" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Target" ALTER COLUMN "attachment" DROP NOT NULL;
