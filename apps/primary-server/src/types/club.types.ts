import { z } from "zod";
import { createClubSchema, updateClubSchema, deleteClubSchema, getClubSchema, getClubsSchema, searchClubsSchema } from "../validators/club.validator";
import mongoose from "mongoose";

export type CreateClubInputType = z.infer<typeof createClubSchema>
export type UpdateClubInputType = z.infer<typeof updateClubSchema>
export type DeleteClubInputType = z.infer<typeof deleteClubSchema>
export type GetClubInputType = z.infer<typeof getClubSchema>
export type GetClubsInputType = z.infer<typeof getClubsSchema>
export type SearchClubsInputType = z.infer<typeof searchClubsSchema>

type clubDetailsType = {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    thumbnail: string | null;
    ispublic: boolean;
    maxMemberLimit: number;
    createdAt: Date;
    updatedAt: Date;
}

export type ClubResponseType = {
    clubs: clubDetailsType[] | [],
    totalPages: number,
    totalDocs: number,
    currentPage: number
};
