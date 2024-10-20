/*
  Warnings:

  - You are about to alter the column `tgl_transaksi` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `transaksi` MODIFY `tgl_transaksi` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
