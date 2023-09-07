import User from "../models/user.model";

const handleVotesCount = (opinions: Omit<Omit<any, never>, never>[], opinions_my_votes_only: Omit<any, never>[] | undefined, childrenVotesCount: boolean = false) => {
    let opinions_final: any[] = []
    opinions.forEach((opinion, index) => {
        let newOpinion = JSON.parse(JSON.stringify(opinion));
        if (opinions_my_votes_only) {
            newOpinion.myVote = opinions_my_votes_only[index].votes[0] ? opinions_my_votes_only[index].votes[0].type : "";
        }
        else {
            newOpinion.myVote = ""
        }
        if (childrenVotesCount) {
            if (opinion.children && opinion.children.length > 0) {
                let finalChildren: any[] = [];
                opinion.children.forEach((childOpinion: any, childIndex: any) => {
                    let newChildOpinion = JSON.parse(JSON.stringify(childOpinion));
                    if (opinions_my_votes_only) {
                        newChildOpinion.myVote = opinions_my_votes_only[index].children[childIndex].votes[0] ? opinions_my_votes_only[index].children[childIndex].votes[0].type : "";
                    }
                    else {
                        newChildOpinion.myVote = ""
                    }
                    finalChildren.push(newChildOpinion)
                })
                newOpinion.children = finalChildren;
            }
        }
        opinions_final.push(newOpinion)
    });
    return opinions_final;
}

const replaceMentions = async (text: string): Promise<string> => {
    let splitted = text.split(" ")
    let textList = []
    for (let i in splitted) {
        let item = splitted[i]
        if (item.startsWith("@")) {
            const selectedUserName = item.split("@")[1]
            const user = (await User.findOne({ username: selectedUserName }, { id: 1 })) as UserType
            if (user && user.id) {
                let newTextSlice = `<a class="global-mention" href="/profile/${user.id}">${item}</a>`
                textList.push(newTextSlice)
            }
            else {
                textList.push(item)
            }
        }
        else {
            textList.push(item)
        }
    }

    text = textList.join(" ");
    return text
}

export { handleVotesCount, replaceMentions }