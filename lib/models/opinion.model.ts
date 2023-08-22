import mongoose from 'mongoose';

const opinionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    giphyId: {
        type: String
    },
    agreements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    agreementsCount: {
        type: Number,
        default: 0
    },
    reposts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    repostCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentId: {
        type: String,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Opinion'
        }
    ]
});

const Opinion = mongoose.models.Opinion || mongoose.model('Opinion', opinionSchema);

export default Opinion;
