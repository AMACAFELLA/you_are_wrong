import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const host = req.headers.host;
    // const protocol = req.protocol;
    const protocol = "https://"
    return {
        props: {
            host,
            protocol,
        },
    };
};