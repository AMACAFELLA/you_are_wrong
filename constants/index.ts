import { dark } from "@clerk/themes";
import rainbowColors from './rainbow.json'
export const sidebarLinks = [
    {
        imgURL: "/assets/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/search.svg",
        route: "/search",
        label: "Search",
    },
    {
        imgURL: "/assets/create.svg",
        route: "/create-opinion",
        label: "Create Opinion",
    },
    {
        imgURL: "/assets/heart.svg",
        route: "/activity",
        label: "Activity",
    },
    {
        imgURL: "/assets/community.svg",
        route: "/communities",
        label: "Communities",
    },
    {
        imgURL: "/assets/user.svg",
        route: "/profile",
        label: "Profile",
    },
];

export const profileTabs: TabTypes = [
    { value: "opinions", label: "Opinions", icon: "/assets/reply.svg" },
    { value: "replies", label: "Replies", icon: "/assets/members.svg" },
    { value: "mentioned", label: "Mentioned", icon: "/assets/atsign.svg" },
];

export const communityTabs: TabTypes = [
    { value: "opinions", label: "Opinions", icon: "/assets/reply.svg" },
    { value: "members", label: "Members", icon: "/assets/members.svg" },
    { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

export const clerckComponentsOptions: any = {
    baseTheme: dark,
    variables: {},
    layout: {
        logoPlacement: "inside",
        logoImageUrl: "/assets/logo.png",
        shimmer: true,
        socialButtonsVariant: "blockButton",
    },
    elements: {
        formButtonPrimary: "bg-primary-500 hover:bg-opacity-90",
        formButtonPrimary__loading: "bg-secondary-500",
        // footerAction__signIn: "",
        footerActionLink: "text-primary-500",
    },
}

export const digitalRainbowColors: {
    [index: string]: string
} = rainbowColors