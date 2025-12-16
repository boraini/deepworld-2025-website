import { playerApi, proxied } from "./common";

export { RankingsRoute } from "./HandlebarsRoutes";

const stats = [
    "items_mined",
    "items_placed",
    "items_crafted",
] as const;
export function RankingsPlaceholderLoader() {
    return Object.fromEntries(stats.map(stat => [stat, { ExpectedNumberOfItems: 50 }]))
}
export async function RankingsLoader(params, { onError }) {
    const responses = await Promise.all(
        stats.map((s) =>
            fetch(proxied(`${playerApi}/players?sort=${s}`)),
        ),
    );
    const failed = responses.find((r) => !r.ok);
    if (failed) {
        onError({
            message: "Error occurred while fetching data.",
            stackTrace: await failed.text(),
        });
        return null;
    }
    const result = {};
    for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        const data = (await responses[i].json()).map((p) => [
            p.name,
            p[stat],
        ]);
        result[stat] = { data: data, ExpectedNumberOfItems: 50 };
    }

    return result
}
