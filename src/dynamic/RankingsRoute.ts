import { playerApi, proxied } from "./common"
import { extractRankingData, RankingTitle } from "./RankingCommon.js"

export { RankingsRoute as Component } from "./HandlebarsRoutes"

const stats = [
    "items_mined",
    "items_placed",
    "items_crafted",
    "statistics.dungeons_raided",
    "statistics.shillings_spent",
    "statistics.landmark_votes_received",
] as const

type LoaderData = Record<(typeof stats)[number], RankingContext> & {
    stats: { key: string; title: string }[]
    disableLinks?: boolean
}

const ExpectedNumberOfItems = 20
export function placeholderLoader() {
    return {
        stats: stats.map((key) => ({ key: key, title: RankingTitle[key] })),
        ...Object.fromEntries(
            stats.map((stat) => [stat, { ExpectedNumberOfItems }])
        ),
    } as unknown as LoaderData
}

export async function loader(
    { disableLinks }: { disableLinks?: boolean },
    { onError }
) {
    const responses = await Promise.all(
        stats.map((s) =>
            fetch(proxied(`${playerApi}/players?sort=${s}&admin=false`))
        )
    )
    const failed = responses.find((r) => !r.ok)
    if (failed) {
        onError({
            message: "Error occurred while fetching data.",
            stackTrace: await failed.text(),
        })
        return null
    }
    const result = {
        disableLinks,
        stats: stats.map((key) => ({ key: key, title: RankingTitle[key] })),
    }
    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]
        const data = extractRankingData(
            (await responses[i].json()).slice(0, ExpectedNumberOfItems),
            stat
        )
        result[stat] = { data: data, ExpectedNumberOfItems }
    }

    return result as LoaderData
}
export async function HeaderConfig(route: { username: string }) {
    return {
        title: `${route.username} on Deepworld 2025 MMO`,
        backlink: "/players",
    }
}
