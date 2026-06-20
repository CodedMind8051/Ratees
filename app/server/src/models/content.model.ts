import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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
        backdrop: {
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
                type: String,
                required: true
            },
            logo: {
                type: String,
                required: true
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

const TrendingContentSchema = new Schema({

    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
        required: true,

    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    Content_Type: {
        type: String,
        required: true
    }


}, {
    timestamps: true
})


ContentSchema.plugin(mongooseAggregatePaginate)

export const Content = mongoose.model("Content", ContentSchema)
export const TrendingContent = mongoose.model("TrendingContent", TrendingContentSchema)