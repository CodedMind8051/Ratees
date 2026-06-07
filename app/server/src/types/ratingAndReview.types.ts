import { RateSchema } from "../validators/validator";
import { z } from "zod";

export type SubmitRatingInput = z.infer<typeof RateSchema>