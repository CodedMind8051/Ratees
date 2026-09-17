import { contentResolver } from "./content.resolver";
import { rateResolver } from "./rate.resolver";
import { reviewResolver } from "./review.resolver";
import { playlistResolver } from "./playlist.resolver";
import { watchStatusResolver } from "./watchStatus.resolver";
import { userResolver } from "./user.resolver";
import { clubResolver } from "./club.resolver";

const resolvers = [
    contentResolver,
    rateResolver,
    reviewResolver,
    playlistResolver,
    watchStatusResolver,
    userResolver,
    clubResolver
]

export { resolvers }