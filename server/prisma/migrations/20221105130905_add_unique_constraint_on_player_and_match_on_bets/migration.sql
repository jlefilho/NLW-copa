/*
  Warnings:

  - A unique constraint covering the columns `[playerId,matchId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bet_playerId_matchId_key" ON "Bet"("playerId", "matchId");
