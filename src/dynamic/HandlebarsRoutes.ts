import Handlebars from "handlebars"

import PendingRowHbs from "./PendingRow.hbs?raw"

import RankingsRouteHbs from "./RankingsRoute.hbs?raw"
import RankingHbs from "./Ranking.hbs?raw"

import PlayerRouteHbs from "./PlayerRoute.hbs?raw"
import PlayerKillsHbs from "./PlayerKills.hbs?raw"
import PlayerKVHbs from "./PlayerKV.hbs?raw"

import { AccomplishmentsSectionItem, GenericSectionItem } from "./PlayerInfo"

const HandlebarsDynamic = Handlebars.create()

HandlebarsDynamic.registerPartial("PendingRow", PendingRowHbs)
HandlebarsDynamic.registerPartial("Ranking", RankingHbs)
HandlebarsDynamic.registerPartial("PlayerKills", PlayerKillsHbs)
HandlebarsDynamic.registerPartial("PlayerKV", PlayerKVHbs)

HandlebarsDynamic.registerHelper('oneBased', n => n + 1)
function formatNumber(n: number) {
    const raw = n.toString()

    const foundDecimalIndex = raw.indexOf(".")
    const decimalIndex = foundDecimalIndex == -1 ? raw.length : foundDecimalIndex
    const intStart = n < 0 ? 1 : 0
    const numIntDigits = decimalIndex - intStart
    if (numIntDigits <= 4) return raw
    let result = raw.substring(decimalIndex)
    for (let end = decimalIndex; end > 0; end -= 3) {
        result = raw.substring(end - 3, end) + result
        if (end - 3 > intStart) result = "," + result
    }
    if (n < 0) result = "-" + result
    return result
}
HandlebarsDynamic.registerHelper('formatNumber', formatNumber)

HandlebarsDynamic.registerHelper('times', function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

HandlebarsDynamic.registerHelper('resolveDataPath', function (data, dataPath: string[]) {
    let finger = data
    for (const segment of dataPath) {
        finger = finger[segment];
    }
    return typeof finger === "number" ? formatNumber(finger) : finger
})

interface RankingContext {
    ExpectedNumberOfItems: number
    data?: [string, number][]
}

export const RankingsRoute = HandlebarsDynamic.compile<{
    items_mined: RankingContext,
    items_placed: RankingContext,
    items_crafted: RankingContext,
} | undefined>(RankingsRouteHbs)

export const PlayerRoute = HandlebarsDynamic.compile<{
    data: any,
    accomplishments: {
        config: Record<string, AccomplishmentsSectionItem>,
        ExpectedNumberOfItems: number,
    }
    vitals: {
        config: Record<string, GenericSectionItem>,
        ExpectedNumberOfItems: number,
    }
    kills: {
        labels: Record<string, string>,
        data: Record<string, number>,
        ExpectedNumberOfItems: number,
    }
} | undefined>(PlayerRouteHbs)
