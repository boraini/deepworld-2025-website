export const RankingTitle = {
    items_mined: "Items Mined",
    items_crafted: "Items Crafted",
    items_placed: "Items Placed",
    "statistics.shillings_spent": "Shillings Spent",
    "statistics.dungeons_raided": "Dungeons Raided",
    "statistics.landmark_votes_received": "Landmark Votes Received",
}

export function extractRankingData<T extends { name: string }>(
    list: T[],
    key: string
) {
    const segments = key.split(".")
    const pts = list.map((item) => [item.name, item] as [string, T | number])
    for (const segment of segments) {
        pts.forEach((item) => {
            item[1] = item[1][segment]
        })
    }
    return pts as [string, unknown][] as [string, number][]
}
