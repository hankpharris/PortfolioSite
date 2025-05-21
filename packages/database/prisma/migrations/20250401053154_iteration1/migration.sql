-- CreateTable
CREATE TABLE "ServiceRequest" (
    "submissionID" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "device" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "employeeID" INTEGER NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("submissionID")
);

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
