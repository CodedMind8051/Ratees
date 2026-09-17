import { contentTypeDefs } from "./content.schema";
import { rateTypeDefs } from "./rate.schema";
import { reviewTypeDefs } from "./review.schema";
import { playlistTypeDefs } from "./playlist.schema";
import { watchStatusTypeDefs } from "./watchStatus.schema"
import { userTypeDefs } from "./user.schema"
import { clubTypeDefs } from "./club.schema"


const typeDefs = [contentTypeDefs, rateTypeDefs, reviewTypeDefs, playlistTypeDefs, watchStatusTypeDefs, userTypeDefs, clubTypeDefs]

export { typeDefs }