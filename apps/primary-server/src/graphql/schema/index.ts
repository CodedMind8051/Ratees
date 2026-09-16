import { contentTypeDefs } from "./content.schema";
import { rateTypeDefs } from "./rate.schema";
import { reviewTypeDefs } from "./review.schema";
import { playlistTypeDefs } from "./playlist.schema";
import { watchStatusTypeDefs } from "./watchStatus.schema"
import { userTypeDefs } from "./user.schema"


const typeDefs = [contentTypeDefs, rateTypeDefs, reviewTypeDefs, playlistTypeDefs, watchStatusTypeDefs, userTypeDefs]

export { typeDefs }