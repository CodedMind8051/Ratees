export interface ContentItemTypeHomePage {
  title: string;
  release_date?: string
  _id: string;
  Content_Type?: "movie" | "tv" | "N/A"
  genre: string[];
  poster: string;
  backdrop: string;
  description: string;
}


// type WatchPlatform = {
//     platform: string;
//     logo: string;
// };

type Cast = {
    name: string;
    character: string;
    profile_path: string;
};



export interface ContentFullDetail extends ContentItemTypeHomePage {
  runtime?: string,
  director?:string,
  reviews?:[],
  WatchPlatform?:[],
  Cast?:Cast[],
  aggregateRating?:any,
  ratingDistribution?:any
}


