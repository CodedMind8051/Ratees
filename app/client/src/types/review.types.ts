
export interface Review {
    _id: string;
    userId: string;
    username: string;
    profileImage: string; 
    review: string;
    createdAt: string;
    isOwn: boolean;
}

export interface ReviewFormValues {
    comment: string;
}
