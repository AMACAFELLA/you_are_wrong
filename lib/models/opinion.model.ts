import { Schema, models, model } from 'mongoose'
const opinionSchema = new Schema({
    text: { type: String, required: true },
    repost: { // source opinion._id 
        type: Schema.Types.ObjectId,
        ref: 'Opinion'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Opinion'
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Opinion'
        }
    ],
    votes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Vote'
        }
    ],
    votePoints: { type: Number, default: 0 }
}, { timestamps: true })

opinionSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Opinion = models.Opinion || model('Opinion', opinionSchema)

export default Opinion

// Oirignal Opinion
//     -> Opinion Disagreement 1
//     -> Opinion Disagreement 2
//         -> Opinion Disagreement 3