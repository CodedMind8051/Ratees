import mongoose, { Schema } from "mongoose"

const ContentSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        poster: {
            type: String,
            required: true
        },

        runtime: {
            type: String
        }
        ,

        release_date: {
            type: String
        },
        whereTOwatch: [{
            platform: {
                type: String
            },
            link: {
                type: String
            }
        }],

        Content_Type: {
            type: String,
            required: true,
            enum: ["movie", "tv"]
        },

        genre: [
            {
                type: String,
                required: true
            }
        ],
        casts: {
            type: [
                {
                    name: String,
                    character: String,
                    profile_path: String
                }
            ],
            validate: {
                validator: function (value: []) {
                    return value.length <= 4
                }
            }
        },
        director: {
            type: [
                {
                    name: String,
                    profile_path: String
                }
            ],
            validate: {
                validator: function (value: []) {
                    return value.length <= 2
                }
            }
        },
        total_number_of_ratings: {
            type: Number,
            default: 0
        },
        total_seasons: {
            type: Number,
            required: function () {
                return this.Content_Type === "tv"
            }
        },
        total_episodes: {
            type: Number,
            required: function () {
                return this.Content_Type === "tv"
            }
        }

    },
    {
        timestamps: true
    }
)

export const Content = mongoose.model("Content", ContentSchema)