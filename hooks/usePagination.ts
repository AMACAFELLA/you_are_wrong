import { useEffect, useState } from "react";
const usePagination = ({ options, initialValues, getToken, targetClass }: UsePaginationProps): [boolean, any[] | null] => {
    const { initailDocs, initialLoading, initialHasNext, initialPageNumber } = initialValues
    const [activities, setActivities] = useState<any[] | null>(initailDocs);
    const [loading, setLoading] = useState<boolean>(initialLoading);
    const [reaching, setReaching] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const { baseUrl, pageSize, postFixQs } = options;
    const [hasNext, setHasHext] = useState<boolean>(initialHasNext);
    const [pageQueue, setPageQueue] = useState<Number[]>([])

    const fetchActivities = async (page: number, next: boolean, abortController?: AbortController) => {
        // for debug purposes only
        // setPageQueue((queue) => {
        //     if (queue.indexOf(page) === -1) {
        //         return queue.concat(page)
        //     }
        //     else {
        //         return queue
        //     }
        // })
        // console.log(pageQueue)
        if (!loading && next) {
            setLoading((_) => true);

            let headers: { Authorization?: string } = {}
            const token = await getToken();
            if (token)
                headers["Authorization"] = `Bearer ${token}`
            let params: { headers: { Authorization?: string }, cache?: string, signal?: AbortSignal } = {
                headers: headers,
                cache: "no-cache",
            }
            if (abortController) {
                params.signal = abortController.signal
            }
            const acts = await fetch(
                `${baseUrl}?pageNumber=${page}&pageSize=${pageSize}${postFixQs}`,
                { ...params as RequestInit }
            ).then((res) => res.json());

            setHasHext((_) => acts.hasNext);
            setActivities((_acts) => {
                if (!_acts) {
                    return acts.docs;
                } else {
                    return _acts.concat(acts.docs);
                }
            });
            setLoading((_) => false);

        }
    };
    const scrollHandler = () => {
        setReaching((prev) => {
            var element;
            if (targetClass) {
                element = document.querySelector(targetClass)
            }

            const condition = element ? Math.round(element.scrollTop) + element.clientHeight + 100 >= element.scrollHeight
                : Math.round(window.scrollY) + window.outerHeight + 100 >= document.body.offsetHeight

            if (condition) {
                if (!prev) {
                    setLoading((loading) => {
                        setHasHext((hasNext) => {
                            if (!loading && hasNext)
                                setPageNumber((prev) => prev + 1);
                            return hasNext
                        })
                        return loading
                    })

                }
                return true;
            } else {
                return false;
            }
        });
    };

    const attachScrollHandler = () => {
        var element;
        if (targetClass) {
            element = document.querySelector(targetClass)
        }
        if (element) element.addEventListener("scroll", scrollHandler);
        else window.addEventListener("scroll", scrollHandler);
    };
    const clearScrollHandler = () => {
        var element;
        if (targetClass) {
            element = document.querySelector(targetClass)
        }
        if (element) element.removeEventListener("scroll", scrollHandler);
        else window.removeEventListener("scroll", scrollHandler);
    };

    const needsAbortion = (baseUrl === "/api/user/search");

    useEffect(() => {

        const abortController = needsAbortion ? new AbortController() : undefined
        fetchActivities(pageNumber, true, abortController);
        if (initialHasNext) {
            attachScrollHandler();
        }
        return () => {
            abortController?.abort()
            return clearScrollHandler();
        };

    }, []);


    useEffect(() => {
        if (initialHasNext) {
            const abortController = needsAbortion ? new AbortController() : undefined
            if (pageNumber > initialPageNumber) fetchActivities(pageNumber, hasNext, abortController);
            // console.log(pageNumber)
            return () => {
                abortController?.abort()
            }
        }
    }, [pageNumber]);

    return [loading, activities]

}
export default usePagination