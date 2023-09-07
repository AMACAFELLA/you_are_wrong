interface OpinionsResultType {
    docs: any[];
    hasNext: boolean;
    totalOpinionsCount: number;
    pageNumber: number;
    pageSize: number;
}
interface OpinionsTabsPropsType {
    currentUserId: string;
    accountId: string;
    label: string;
}