import { contentResolver } from "./content.resolver";
import { rateResolver } from "./rate.resolver";
import { reviewResolver } from "./review.resolver";
import { playlistResolver } from "./playlist.resolver";

const resolvers = [contentResolver, rateResolver, reviewResolver, playlistResolver]

export { resolvers }