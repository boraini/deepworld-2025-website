import { playerApi, proxied } from "./common"

export { RankingsRoute as Component } from "./HandlebarsRoutes"

const stats = ["items_mined", "items_placed", "items_crafted"] as const

type LoaderData = Record<(typeof stats)[number], RankingContext> & {
    disableLinks?: boolean
}
export function placeholderLoader() {
    return Object.fromEntries(
        stats.map((stat) => [stat, { ExpectedNumberOfItems: 50 }])
    ) as unknown as LoaderData
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
    }
    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]
        const data = (await responses[i].json()).map((p) => [p.name, p[stat]])
        result[stat] = { data: data, ExpectedNumberOfItems: 50 }
    }

    return result as LoaderData
}
export async function HeaderConfig(route: { username: string }) {
    return {
        title: `${route.username} on Deepworld 2025 MMO`,
        backlink: "/players",
    }
}
