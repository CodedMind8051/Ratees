import { contentTypeDefs } from "./content.schema";
import {rateTypeDefs} from "./rate.schema";
import { reviewTypeDefs } from "./review.schema";
import { playlistTypeDefs } from "./playlist.schema";

const typeDefs = [contentTypeDefs ,rateTypeDefs , reviewTypeDefs, playlistTypeDefs]

export { typeDefs }