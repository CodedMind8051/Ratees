import { RateSchema } from "../validators/content.validator";
import { z } from "zod";

export type SubmitRatingInput = z.infer<typeof RateSchema>