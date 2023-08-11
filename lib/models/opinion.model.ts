import mongoose from 'mongoose';

const opinionSchema = new mongoose.Schema({
    text: { tyoe: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
    },
    parentId: {
        type: String,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Opinion'
        }
    ]
})

const Opinion = mongoose.models.Opinion || mongoose.model('Opinion', opinionSchema);

export default Opinion;