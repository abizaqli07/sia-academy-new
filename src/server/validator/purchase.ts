import { z } from "zod";

export const GetInvoiceDataSchema = z.object({
  invoiceId: z.string(),
});