import { Schema, models, model } from 'mongoose'
const followSchema = new Schema({

    follower: { // source opinion._id 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    following: { // source opinion._id 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true })

followSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Follow = models.Follow || model('Follow', followSchema)

export default Follow
