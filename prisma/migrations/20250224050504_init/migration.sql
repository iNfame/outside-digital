-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_vehicleId_timestamp_idx" ON "event"("vehicleId", "timestamp");
