import Handlebars from "handlebars"

import PendingRowHbs from "./PendingRow.hbs?raw"

import RankingsRouteHbs from "./RankingsRoute.hbs?raw"
import RankingHbs from "./Ranking.hbs?raw"

import PlayerRouteHbs from "./PlayerRoute.hbs?raw"
import PlayerKillsHbs from "./PlayerKills.hbs?raw"
import PlayerKVHbs from "./PlayerKV.hbs?raw"
import TradeLedgerHbs from "./TradeLedger.hbs?raw"

import { AccomplishmentsSectionItem, GenericSectionItem } from "./PlayerRoute"

const HandlebarsDynamic = Handlebars.create()

HandlebarsDynamic.registerPartial("PendingRow", PendingRowHbs)
HandlebarsDynamic.registerPartial("Ranking", RankingHbs)
HandlebarsDynamic.registerPartial("PlayerKills", PlayerKillsHbs)
HandlebarsDynamic.registerPartial("PlayerKV", PlayerKVHbs)
HandlebarsDynamic.registerPartial("TradeLedger", TradeLedgerHbs)

HandlebarsDynamic.registerHelper("oneBased", (n) => n + 1)
function formatNumber(n: number) {
    const raw = n.toString()

    const foundDecimalIndex = raw.indexOf(".")
    const decimalIndex =
        foundDecimalIndex == -1 ? raw.length : foundDecimalIndex
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

function formatRomanSimple(n: number) {
    console.log(n)
    if (n <= 0) return `(${n})`

    function formatSegment(n, s1, s5, s10) {
        if (n < 1) return ""
        const scrutinee = Math.max(1, Math.min(9, Math.floor(n)))
        console.log(n, scrutinee)
        if (scrutinee === 2) return s1 + s1
        if (scrutinee === 3) return s1 + s1 + s1
        if (scrutinee === 4) return s1 + s5
        if (scrutinee === 5) return s5
        if (scrutinee === 6) return s5 + s1
        if (scrutinee === 7) return s5 + s1 + s1
        if (scrutinee === 8) return s5 + s1 + s1 + s1
        if (scrutinee === 9) return s1 + s10
        return s1
    }

    let result = ""
    for (let i = 1000; i <= n; i += 1000) {
        result += "M"
    }

    return (
        result +
        formatSegment((n / 100) % 10, "C", "D", "M") +
        formatSegment((n / 10) % 10, "X", "L", "C") +
        formatSegment(n % 10, "I", "V", "X")
    )
}

function formatRoman(n: number) {
    if (n < 4000) return formatRomanSimple(n)
    const billions = formatRomanSimple((n / 1000_000_000) % 1000)
    const millions = formatRomanSimple((n / 1000_000) % 1000)
    const thousands = formatRomanSimple((n / 1000) % 1000)
    const ones = formatRomanSimple(n % 1000)

    let result = ""
    if (billions.length > 0) result += ` ${billions} billion`
    if (millions.length > 0) result += ` ${millions} million`
    if (thousands.length > 0) result += ` ${thousands} thousand`
    if (ones.length > 0) result += ` ${ones}`

    return result.substring(1)
}

function formatSeconds(n: number) {
    const conv = [
        [1, "second", "seconds"],
        [60, "minute", "minutes"],
        [60, "hour", "hours"],
        [24, "day", "days"],
    ] as const

    if (n <= 1) return `(${n})`

    const segments = []
    for (let i = 0; i < conv.length - 1; i++) {
        n /= conv[i][0]
        segments.push(Math.floor(n % conv[i + 1][0]))
    }
    segments.push(Math.floor(n / conv[conv.length - 1][0]))

    let result = ""
    for (let i = conv.length - 1; i >= 0; i--) {
        if (segments[i] > 0) {
            result += `, ${segments[i]} ${segments[i] === 1 ? conv[i][1] : conv[i][2]}`
        }
    }

    return result.substring(2)
}

HandlebarsDynamic.registerHelper("formatNumber", formatNumber)

HandlebarsDynamic.registerHelper("formatRoman", formatRoman)

HandlebarsDynamic.registerHelper("formatSeconds", formatSeconds)

HandlebarsDynamic.registerHelper("times", function (n, block) {
    var accum = ""
    for (var i = 0; i < n; ++i) accum += block.fn(i)
    return accum
})

HandlebarsDynamic.registerHelper(
    "resolveDataPath",
    function (data, dataPath: string[]) {
        let finger = data
        for (const segment of dataPath) {
            finger = finger[segment]
        }
        return typeof finger === "number" ? formatNumber(finger) : finger
    }
)

export const RankingsRoute = HandlebarsDynamic.compile<
    | {
          items_mined: RankingContext
          items_placed: RankingContext
          items_crafted: RankingContext
      }
    | undefined
>(RankingsRouteHbs)

export const PlayerRoute = HandlebarsDynamic.compile<
    | {
          data: any
          accomplishments: {
              config: Record<string, AccomplishmentsSectionItem>
              ExpectedNumberOfItems: number
          }
          vitals: {
              config: Record<string, GenericSectionItem>
              ExpectedNumberOfItems: number
          }
          kills: {
              labels: Record<string, string>
              data: Record<string, number>
              ExpectedNumberOfItems: number
          }
      }
    | undefined
>(PlayerRouteHbs)
