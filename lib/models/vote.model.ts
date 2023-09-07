import { Schema, models, model } from 'mongoose'
const voteSchema = new Schema({
    type: {
        type: String,
        validate: {
            validator: (value: string) => {
                return ["down", "up", ""].includes(value);
            },
            message: 'Invalid type value / only ["down", "up", ""] are allowed'
        }
    },
    voter: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    opinion: {
        type: Schema.Types.ObjectId,
        ref: 'Opinion'
    },
}, { timestamps: true })

voteSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Vote = models.Vote || model('Vote', voteSchema)

export default Vote
