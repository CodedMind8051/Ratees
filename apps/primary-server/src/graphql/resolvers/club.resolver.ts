import { createClub, getClub, getClubs, updateClub, deleteClub, searchClubs } from "../../controllers/club.controller";
import { isAuthenticated } from "../../middlewares/auth.middleware";
import type { MyContextType } from "../../types/graphql.types";
import type { CreateClubInputType, UpdateClubInputType, DeleteClubInputType, GetClubInputType, GetClubsInputType, SearchClubsInputType } from "../../types/club.types";

export const clubResolver = {
    Query: {
        getClub: async (_: any,
            {
                clubId
            }: GetClubInputType,
            context: MyContextType
        ) => {

            const club = await getClub({ clubId })
            return club
        },
        getClubs: async (_: any,
            {
                page
            }: GetClubsInputType,
            context: MyContextType
        ) => {

            const clubs = await getClubs({ page })
            return clubs
        },
        searchClubs: async (_: any,
            {
                searchTerm,
                page
            }: SearchClubsInputType,
            context: MyContextType
        ) => {

            const clubs = await searchClubs({ searchTerm, page })
            return clubs
        }
    },
    Mutation: {
        createClub: async (_: any,
            {
                name,
                description,
                password,
                thumbnail,
                ispublic,
                maxMemberLimit
            }: CreateClubInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;
            const result = await createClub({ name, description, password, thumbnail, ispublic, maxMemberLimit, userId })
            return result
        },
        updateClub: async (_: any,
            {
                clubId,
                name,
                description,
                password,
                thumbnail,
                ispublic,
                maxMemberLimit
            }: UpdateClubInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await updateClub({ clubId, userId, name, description, password, thumbnail, ispublic, maxMemberLimit })
            return result
        },
        deleteClub: async (_: any,
            {
                clubId
            }: DeleteClubInputType,
            context: MyContextType) => {

            isAuthenticated(context)
            const userId = (context?.req?.session as any)?.session?.userId;

            const result = await deleteClub({ clubId, userId })
            return result
        }
    }
}
