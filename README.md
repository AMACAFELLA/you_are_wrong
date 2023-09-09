# You're Wrong

You're Wrong is a social media web application built with Next.js, Tailwind CSS, and MongoDB. Users can post opinions, disagree with other users' opinions, and more.

## Features

- User authentication with Clerk
- Create/update user profile
- Post text opinions
- Search for gifs with Giphy API to embed in opinions
- View opinion feed
- Reply to opinions with disagreements
- Delete own opinions
- User activity feed
- Search for communities
- Search for users
- Webhooks with Clerk to sync data

## Code Overview

The app is built with:

- Next.js - For server-side rendering and API routes
- Tailwind CSS - For styling
- MongoDB - For storing user profiles, opinions, communities, etc.
- Mongoose - For interacting with MongoDB
- Clerk - For user authentication and management
- Giphy API - For embedding gifs

The main models are:

- User - Stores user profile information like name, username, bio, etc.
- Opinion - Stores posted opinions text, author, community, replies, etc.
- Community - Stores community information like name, members, etc.

The main pages are:

- Homepage - Shows opinion feed
- Profile - Shows user's opinions and info
- Post opinion - Create a new opinion
- Activity - Shows recent replies to user's opinions
- Communities - Browse and search communities
- Community profile - View community info and members
- Search - Search for users

Authentication uses Clerk with custom pages for signup and login.

The UI uses React components from Radix UI like Tabs, Menu, Toast, etc.

## Setup

1. Clone the repo
2. Run `npm install`
3. Set up environment variables
4. Start MongoDB server
5. Run `npm run dev`

## Future Improvements

Some ideas for future improvements:

- Notifications for replies, new followers, etc.
- Improved search with filters
- User following
- Admin dashboard to moderate content
- Improve accessibility
