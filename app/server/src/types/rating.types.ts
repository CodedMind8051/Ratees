import { RateSchema } from "../validators/rating.validator";
import { z } from "zod";

export type SubmitRatingInput = z.infer<typeof RateSchema>