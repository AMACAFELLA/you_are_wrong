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
    userAgrees: [
        {
            //type: String
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

});

const Opinion = mongoose.models.Opinion || mongoose.model('Opinion', opinionSchema);

export default Opinion;
