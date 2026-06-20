import type { ContentDetailsType } from "../types/content.types"

export const TmdbContentToContentDocument = (content: any): ContentDetailsType => {
    return {
        _id: content?.ContentId,
        title: content?.title || content?.name,
        description: content?.overview || "N/A",
        poster: content?.poster_path || "N/A",
        backdrop: content?.backdrop_path || "N?A",
        release_date: content?.release_date || content?.first_air_date || "N/A",
        genre: content?.genres ? content.genres.map((genre: any) => genre.name) : [],
        Content_Type: content?.Content_Type || "N/A",
        runtime: content?.runtime || "N/A",
        whereTOwatch: content?.["watch/providers"]?.results?.IN?.flatrate ? content?.["watch/providers"]?.results?.IN?.flatrate.map((provider: any) => ({
            platform: provider.provider_name,
            logo: provider.logo_path || "N/A"
        })) : [],
        casts: content?.credits?.cast ? content.credits.cast.slice(0, 4).map((cast: any) => ({
            name: cast.name,
            character: cast.character,
            profile_path: cast.profile_path || "N/A"
        })) : [],

        director: content?.credits?.crew ? content.credits.crew.filter((crew: any) => crew.job === "Director").slice(0, 2).map(
            (director: any) => ({
                name: director.name,
                profile_path: director.profile_path
            })
        ) : [],
        ...(content?.media_type === "tv" && {
            total_episodes: content?.number_of_episodes
        }),
        ...(content?.media_type === "tv" && {
            total_seasons: content?.number_of_seasons
        })
    }

}