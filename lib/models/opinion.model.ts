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
    repostCount: {
        type: Number,
        default: 0
    },

    repostedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
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
    ],
    agrees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    agreeCount: {
        type: Number,
        default: 0
    },

});

const Opinion = mongoose.models.Opinion || mongoose.model('Opinion', opinionSchema);

export default Opinion;
