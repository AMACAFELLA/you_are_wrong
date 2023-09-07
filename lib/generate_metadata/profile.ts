import type { Metadata, ResolvingMetadata } from "next"


export async function generateMetadata(
    { user, host }: { user: any, host: string },
    parent: ResolvingMetadata
): Promise<Metadata> {


    return {
        title: `${user.name} (@${user.username}) on My App`,     //   name
        description: user.bio,
        icons: user.profileImage,    // Make sure the URL is absolute
        openGraph: {
            type: 'website',
            url: `https://myapp.com/user/${user.username}`, // Edit to  URL
            title: `${user.name} (@${user.username}) on MyApp`,
            description: user.bio,
            images: [
                {
                    url: user.profileImage,  // Make sure the URL is absolute
                    width: 800,
                    height: 600,
                    alt: `Profile picture of ${user.username}`
                }
            ],
            siteName: 'My App', //  app name
        },

    }
}