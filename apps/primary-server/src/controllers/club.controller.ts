import { Club } from "@ratees/db";
import { MembersOfClub } from "@ratees/db";
import { ClubJoinRequest } from "@ratees/db";
import { validate } from "../utils/validate.utils";
import { createClubSchema, updateClubSchema, deleteClubSchema, getClubSchema, searchClubsSchema } from "../validators/club.validator";
import { throwGraphqlError } from "../utils/throwGraphqlError.utils";
import { handelGraphqlError } from "../utils/handelError.utils";
import type { CreateClubInputType, UpdateClubInputType, DeleteClubInputType, GetClubInputType, ClubResponseType, SearchClubsInputType } from "../types/club.types";
import mongoose from "mongoose";
import { redisKeys, ttl, getCatchedData, setCachedData, deleteCachedData, hashPassword } from "@ratees/utils";


export const createClub = async (clubData: CreateClubInputType): Promise<boolean> => {

    const session = await mongoose.startSession();
    try {

        await session.startTransaction();

        const {
            name: validatedName,
            description: validatedDescription,
            password: validatedPassword,
            thumbnail: validatedThumbnail,
            ispublic: validatedIsPublic,
            maxMemberLimit: validatedMaxMemberLimit,
            userId: validatedUserId } = validate(createClubSchema, clubData);

        if (!validatedIsPublic && !validatedPassword) {
            throwGraphqlError("Password is required for private clubs", "PASSWORD_REQUIRED", 400, true)
        }

        if (validatedIsPublic && validatedPassword) {
            throwGraphqlError("Password should not be provided for public clubs", "PASSWORD_NOT_ALLOWED", 400, true)
        }

        const existedClub = await Club.exists({
            name: validatedName
        });

        if (existedClub) {
            throwGraphqlError("Club already exists with this name", "CLUB_ALREADY_EXISTS", 409, true)
        }

        const CreatedClub = await Club.create([{
            name: validatedName,
            description: validatedDescription,
            password: validatedPassword,
            thumbnail: validatedThumbnail,
            ispublic: validatedIsPublic,
            maxMemberLimit: validatedMaxMemberLimit
        }], { session });

        if (!CreatedClub || CreatedClub.length === 0) {
            throwGraphqlError("Failed to create club", "CLUB_CREATION_FAILED", 500, true)
        }

        const clubId = (CreatedClub[0] as any)._id;

        const memberCreated = await MembersOfClub.create([{
            clubId: new mongoose.Types.ObjectId(clubId),
            userId: new mongoose.Types.ObjectId(validatedUserId),
            role: "admin"
        }], { session });

        if (!memberCreated || memberCreated.length === 0) {
            throwGraphqlError("Failed to add admin to club", "CLUB_ADMIN_CREATION_FAILED", 500, true)
        }

        await session.commitTransaction();

        return true;

    } catch (error) {
        await session.abortTransaction();
        return handelGraphqlError(error)
    } finally {
        await session.endSession();
    }

}

export const getClub = async ({ clubId }: GetClubInputType) => {

    try {

        const { clubId: validatedClubId } = validate(getClubSchema, { clubId });

        const catchClub = await getCatchedData(redisKeys.club(validatedClubId));

        if (catchClub) {
            return catchClub;
        }

        const club = await Club.findById(new mongoose.Types.ObjectId(validatedClubId));

        if (!club) {
            throwGraphqlError("Club not found", "CLUB_NOT_FOUND", 404, true)
        }

        await setCachedData(redisKeys.club(validatedClubId), club, ttl.club);

        return club;

    } catch (error) {
        return handelGraphqlError(error)
    }
}

export const searchClubs = async ({ searchTerm, page }: SearchClubsInputType): Promise<ClubResponseType> => {
    try {

        const { searchTerm: validatedSearchTerm, page: validatedPage } = validate(searchClubsSchema, { searchTerm, page });

        const cachedClubs = await getCatchedData(redisKeys.search(validatedSearchTerm, validatedPage));

        if (cachedClubs) {
            return cachedClubs;
        }

        const aggregate = Club.aggregate([
            {
                $match: {
                    $or: [
                        { name: { $regex: validatedSearchTerm, $options: "i" } },
                        { description: { $regex: validatedSearchTerm, $options: "i" } }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    thumbnail: 1,
                    ispublic: 1,
                    maxMemberLimit: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        const clubs = await (Club as any).aggregatePaginate(aggregate, {
            page: validatedPage,
            limit: 20,
        });

        if (validatedPage > clubs.totalPages && clubs.totalDocs > 0) {
            throwGraphqlError(
                "Page not found",
                "PAGE_NOT_FOUND",
                404,
                true
            );
        }

        if (!clubs || clubs.totalDocs === 0) {
            return {
                clubs: [],
                totalPages: 0,
                totalDocs: 0,
                currentPage: validatedPage
            };
        }

        const response: ClubResponseType = {
            clubs: clubs.docs,
            totalPages: clubs.totalPages,
            totalDocs: clubs.totalDocs,
            currentPage: validatedPage
        };

        await setCachedData(redisKeys.search(validatedSearchTerm, validatedPage), response, ttl.search);

        return response;

    } catch (error) {
        return handelGraphqlError(error)
    }
};

export const updateClub = async ({
    clubId,
    userId,
    name,
    description,
    password,
    thumbnail,
    ispublic,
    maxMemberLimit
}: UpdateClubInputType): Promise<boolean> => {

    try {

        const {
            clubId: validatedClubId,
            userId: validatedUserId,
            name: validatedName,
            description: validatedDescription,
            password: validatedPassword,
            thumbnail: validatedThumbnail,
            ispublic: validatedIsPublic,
            maxMemberLimit: validatedMaxMemberLimit } = validate(updateClubSchema, {
                clubId,
                userId,
                name,
                description,
                password,
                thumbnail,
                ispublic,
                maxMemberLimit
            });

        const isAdmin = await MembersOfClub.exists({
            clubId: new mongoose.Types.ObjectId(validatedClubId),
            userId: new mongoose.Types.ObjectId(validatedUserId),
            role: "admin"
        });

        if (!isAdmin) {
            throwGraphqlError("You are not authorized to update this club", "FORBIDDEN", 403, true)
        }

        if (validatedName) {
            const existingClub = await Club.exists({
                name: validatedName,
                _id: { $ne: new mongoose.Types.ObjectId(validatedClubId) },
            });

            if (existingClub) {
                throwGraphqlError(
                    "Club already exists with this name.",
                    "CLUB_NAME_ALREADY_EXISTS",
                    409,
                    true
                );
            }
        }

        const updateFields: any = {};
        if (validatedName !== undefined) updateFields.name = validatedName;
        if (validatedDescription !== undefined) updateFields.description = validatedDescription;
        if (validatedPassword !== undefined) !validatedPassword ? updateFields.password = null : updateFields.password = await hashPassword(validatedPassword);
        if (validatedThumbnail !== undefined) updateFields.thumbnail = validatedThumbnail;
        if (validatedIsPublic !== undefined) updateFields.ispublic = validatedIsPublic;
        if (validatedMaxMemberLimit !== undefined) updateFields.maxMemberLimit = validatedMaxMemberLimit;

        const clubUpdated = await Club.updateOne({
            _id: new mongoose.Types.ObjectId(validatedClubId)
        }, {
            $set: updateFields
        });

        if (clubUpdated.matchedCount === 0) {
            throwGraphqlError("Club not found", "CLUB_NOT_FOUND", 404, true)
        }

        if (!clubUpdated.acknowledged) {
            throwGraphqlError("Failed to update club", "CLUB_UPDATE_FAILED", 500, true)
        }

        await deleteCachedData(redisKeys.club(validatedClubId));

        return true

    } catch (error) {
        return handelGraphqlError(error)
    }
}

export const deleteClub = async ({ clubId, userId }: DeleteClubInputType): Promise<boolean> => {

    const session = await mongoose.startSession();
    try {

        await session.startTransaction();

        const { clubId: validatedClubId, userId: validatedUserId } = validate(deleteClubSchema, { clubId, userId });

        const isAdmin = await MembersOfClub.exists({
            clubId: new mongoose.Types.ObjectId(validatedClubId),
            userId: new mongoose.Types.ObjectId(validatedUserId),
            role: "admin"
        });

        if (!isAdmin) {
            throwGraphqlError("You are not authorized to delete this club", "FORBIDDEN", 403, true)
        }

        const clubDeleted = await Club.deleteOne({
            _id: new mongoose.Types.ObjectId(validatedClubId)
        }, {
            session: session
        });

        if (clubDeleted.deletedCount === 0) {
            throwGraphqlError("Club not exists..", "NOT_FOUND", 404, true)
        }

        await MembersOfClub.deleteMany({
            clubId: new mongoose.Types.ObjectId(validatedClubId)
        }, {
            session: session
        });

        await ClubJoinRequest.deleteMany({
            clubId: new mongoose.Types.ObjectId(validatedClubId)
        }, {
            session: session
        });

        await session.commitTransaction();

        await deleteCachedData(redisKeys.club(validatedClubId));


        return true;

    } catch (error) {
        await session.abortTransaction();
        return handelGraphqlError(error)
    } finally {
        await session.endSession();
    }

}
