import { contentResolver } from "./content.resolver";
import { rateResolver } from "./rate.resolver";
import { reviewResolver } from "./review.resolver";

const resolvers = [contentResolver, rateResolver, reviewResolver]

export { resolvers }