import { playerApi, proxied } from "./common"
import { basePath } from "./common.js"
import { extractRankingData, RankingTitle } from "./RankingCommon.js"

export { RankingRoute as Component } from "./HandlebarsRoutes"

const stats = ["items_mined", "items_placed", "items_crafted"] as const

type LoaderData = {
    ranking: RankingContext
    disableLinks?: boolean
}

const maxPlayers = 100
const pageSize = 50
export function placeholderLoader() {
    return Object.fromEntries(
        stats.map((stat) => [stat, { ExpectedNumberOfItems: maxPlayers }])
    ) as unknown as LoaderData
}

export async function loader(
    { type, disableLinks }: { type: string; disableLinks?: boolean },
    { onError }
) {
    const pagesNeeded = Math.round(maxPlayers / pageSize)
    const segmentPromises: Promise<any>[] = []
    for (let i = 1; i <= pagesNeeded; i++) {
        segmentPromises.push(
            fetch(
                proxied(
                    `${playerApi}/players?sort=${type}&page=${i}&admin=false`
                )
            )
        )
    }
    const segmentResults = await Promise.allSettled(segmentPromises)

    const allData: any[] = []
    for (const segmentResult of segmentResults) {
        if (segmentResult.status === "fulfilled" && segmentResult.value.ok) {
            allData.push(...(await segmentResult.value.json()))
        } else {
            break
        }
    }

    if (allData.length === 0) {
        const firstResult = segmentResults[0]
        onError({
            message: "Error occurred while fetching data.",
            stackTrace:
                firstResult.status === "fulfilled"
                    ? await firstResult.value.text()
                    : "Unknown",
        })
    }

    return {
        ranking: {
            data: extractRankingData(allData, type),
            ExpectedNumberOfItems: allData.length,
        },
    } as LoaderData
}

export async function HeaderConfig(route: { type: string }) {
    const title = RankingTitle[route.type] ?? route.type
    return {
        title: `${title}`,
        backlink: `${basePath}/players`,
    }
}
