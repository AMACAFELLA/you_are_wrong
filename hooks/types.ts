interface UsePaginationProps {
    options: {
        baseUrl: string;
        pageSize: number;
        postFixQs: string
    };
    initialValues: {
        initailDocs: any[] | null;
        initialLoading: boolean;
        initialHasNext: boolean;
        initialPageNumber: number;
    };
    getToken: () => Promise<string | null>;
    targetClass?: string
}