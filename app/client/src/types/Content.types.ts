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


type WatchPlatform = {
  platform: string;
  logo: string;
};

type Cast = {
  name: string;
  character: string;
  profile_path: string;
};

type Ratings = {
  masterpiecePercentage?: number 
  TimePassPercentage?: number 
  GoodWatchPercentage?: number 
  wasteOfTimePercentage?: number 
  totalNumberOfRating?: number 
}


export interface ContentFullDetailType extends ContentItemTypeHomePage {
  runtime?: string;
  whereTOwatch?: WatchPlatform[];
  casts?: Cast[];
  director?: string
  userRating?: number
  total_seasons?: number;
  total_episodes?: number;
  Ratings: Ratings
}


