# You're Wrong

You're Wrong is a social platform for respectful disagreements and debates. Users can post opinions and reply with disagreements, which other users can upvote or downvote. The aim is to start thoughtful discussions from different perspectives.

## Features
- Post opinions and reply with disagreements
- Upvote or downvote opinions and disagreements
- User profiles and follows
- Search and explore other users
- Notifications for replies, mentions, reposts, votes, and new followers
- Responsive design
- User authentication with Clerk
- Create/update user profile
- View opinion feed
- Delete own opinions
- User activity feed
- Webhooks with Clerk to sync data

## Code Overview

The app is built with:

- Next.js - For server-side rendering and API routes
- Tailwind CSS - For styling
- MongoDB - For storing user profiles, opinions, communities, etc.
- Mongoose - For interacting with MongoDB
- Clerk - For user authentication and management
- Vercel for hosting

The main models are:

- User - Stores user profile information like name, username, bio, etc.
- Opinion - Stores posted opinions text, author, community, replies, etc.
- Community - Stores community information like name, members, etc.

The main pages are:

- Homepage - Shows opinion feed
- Profile - Shows user's opinions and info
- Post opinion - Create a new opinion
- Activity - Shows recent replies to user's opinions
- Search - Search for users

Authentication uses Clerk. User data is stored in MongoDB.

The UI uses React components from Radix UI like Tabs, Menu, Toast, etc.

## Setup

1. Clone the repo
2. Run `npm install`
3. Set up environment variables
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_CLERK_WEBHOOK_SECRET
- MONGODB_URL
- UPLOADTHING_SECRET
- UPLOADTHING_APP_ID
4. Start MongoDB server
5. Run `npm run dev`

## Future Improvements

Some ideas for future improvements:

- Notifications for disagreements, new followers, etc.
- Improved search with filters
- User following
- Admin dashboard to moderate content
- Improve accessibility
- Search for communities
- Communities - Browse and search communities
- Community profile - View community info and members
- Search for gifs with Giphy API to embed in opinions
- Giphy API - For embedding gifs