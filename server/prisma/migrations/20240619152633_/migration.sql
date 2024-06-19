/*
  Warnings:

  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `photoURL` on the `User` table. All the data in the column will be lost.
  - Added the required column `signInName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayName",
DROP COLUMN "photoURL",
ADD COLUMN     "signInName" TEXT NOT NULL;
