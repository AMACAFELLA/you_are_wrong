import { Schema, models, model } from 'mongoose'
const userSchema = new Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    bio: String,
    followersCount: { type: Number, default: 0 },
    followingsCount: { type: Number, default: 0 },
    color: { type: String, required: true },
    opinions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Opinion'
        }
    ],
    onboarded: { type: Boolean, default: false },
    communities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Community'
        }
    ],
}, { timestamps: true })

userSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const User = models.User || model('User', userSchema)

export default User