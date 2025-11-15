const EntityTitles = {"avatar":"Player","ghost":"Ghost","revenant":"Revenant","dire-revenant":"Dire Revenant","revenant-lord":"Revenant Lord","terrapus/child":"Juvenile Terrapus","terrapus/adult":"Adult Terrapus","terrapus/racing":"Racing Terrapus","terrapus/pet":"Pet Terrapus","terrapus/fire":"Fire Terrapus","terrapus/acid":"Acid Terrapus","terrapus/skeleton":"Skeleton Terrapus","terrapus/frost":"Frost Terrapus","terrapus/queen":"Queen Terrapus","creatures/rat":"Rat","creatures/skunk":"Skunk","creatures/skunk-pet":"Pet Skunk","creatures/armadillo":"Armadillo","creatures/roach":"Roach","creatures/roach-large":"Large Roach","creatures/bunny-ice":"Bunny","creatures/bunny-ice-pet":"Pet Bunny","creatures/crow":"Crow","creatures/crow-auto":"Cyborg Crow","creatures/crow-pet":"Pet Crow","creatures/vulture":"Vulture","creatures/vulture-pet":"Pet Vulture","creatures/bluejay":"Bluejay","creatures/cardinal":"Cardinal","creatures/seagull":"Seagull","creatures/butterfly-monarch":"Monarch Butterfly","creatures/butterfly-papilio-ulysses":"Papilio Ulysees Butterfly","creatures/butterfly-swallowtail":"Swallowtail Butterfly","creatures/butterfly-green":"Green Butterfly","creatures/butterfly-moth":"Moth","creatures/butterfly-owl":"Owl Butterfly","creatures/butterfly-paper-kite":"Paper Kite Butterfly","creatures/butterfly-rumanzovia":"Rumanzovia Butterfly","creatures/scorpion":"Scorpion","creatures/scorpion-large":"Large Scorpion","creatures/bat":"Bat","creatures/bat-auto":"Cyborg Bat","creatures/sandworm":"Sand Worm","creatures/snowworm":"Arctic Worm","creatures/tentacle":"Tentacle Monster","ground/geyser-small":"Geyser","desert/sandstorm":"Sand Storm","automata/android":"Android","automata/cat":"Android Cat","automata/dog":"Android Dog","automata/butler-brass":"Brass Butler Bot","automata/butler-diamond":"Diamond Butler Bot","automata/butler-onyx":"Onyx Butler Bot","automata/tiny":"Tiny Automata","automata/small":"Small Automata","automata/medium":"Medium Automata","automata/large":"Large Automata","brains/tiny-crawler":"Baby Crawler Brain","brains/tiny-flyer":"Baby Flyer Brain","brains/small":"Juvenile Brain","brains/medium":"Adult Brain","brains/medium-dire":"Dire Adult Brain","brains/large":"Brain Lord","aquatic/clownfish":"Clownfish","aquatic/flame-hawkfish":"Flame Hawkfish","aquatic/sergeant-major":"Sergeant Major Fish","aquatic/almaco-jack":"Almaco Jack Fish","aquatic/angelfish":"Angelfish","aquatic/codfish":"Codfish","aquatic/herring":"Herring Fish","aquatic/piranha":"Piranha","aquatic/anemone-red":"Red Anemone","aquatic/anemone-magenta":"Magenta Anemone","aquatic/anemone-electric":"Electric Anemone"}
const SortedEntityIds = Object.keys(EntityTitles).sort((a, b) => EntityTitles[a] < EntityTitles[b] ? -1 : 1)

const VitalsSection = [
//   {
//     "label": "Joined",
//     "dataPath": ""
//   },
  {
    "label": "Level:",
    "dataPath": ["level"]
  },
  {
    "label": "Skill Level:",
    "dataPath": ["skill_level"]
  },
  {
    "label": "Items Mined:",
    "dataPath": ["items_mined"]
  },
  {
    "label": "Items Placed:",
    "dataPath": ["items_placed"]
  },
  {
    "label": "Items Crafted:",
    "dataPath": ["items_crafted"]
  },
  {
    "label": "Deaths:",
    "dataPath": ["deaths"]
  }
]

const AccomplishmentsSection = [
//   {
//     "label": "Animals Trapped:",
//     "dataPath": "108"
//   },
  {
    "label": "Areas Discovered:",
    "dataPath": ["statistics", "areas_explored"]
  },
  {
    "label": "Automata Killed:",
    "dataPath": ["computed", "automata_killed"]
  },
  {
    "label": "Brains Killed:",
    "dataPath": ["computed", "brains_killed"]
  },
  {
    "label": "Chests Looted:",
    "dataPath": ["statistics", "containers_looted"]
  },
  {
    "label": "Creatures Killed:",
    "dataPath": ["computed", "creatures_killed"]
  },
//   {
//     "label": "Creatures Maimed:",
//     "dataPath": "4,779"
//   },
  {
    "label": "Deliverances:",
    "dataPath": ["statistics", "deliverances"]
  },
  {
    "label": "Dungeons Raided:",
    "dataPath": ["statistics", "dungeons_raided"]
  },
  {
    "label": "Infernal Parts Discovered:",
    "dataPath": ["computed", "expiator_parts_discovered"]
  },
//   {
//     "label": "Inhibitors Activated:",
//     "dataPath": "101"
//   },
  {
    "label": "Landmarks Upvoted:",
    "dataPath": ["statistics", "landmarks_upvoted"]
  },
  {
    "label": "Maws Plugged:",
    "dataPath": ["statistics", "maws_plugged"]
  },
  {
    "label": "Minerals Mined:",
    "dataPath": ["statistics", "minerals_mined"]
  },
  {
    "label": "Players Killed:",
    "dataPath": ["statistics", "players_killed"]
  },
  {
    "label": "Purifier Parts Discovered:",
    "dataPath": ["computed", "purifier_parts_discovered"]
  },
  {
    "label": "Supernatural Killed:",
    "dataPath": ["computed", "supernatural_killed"]
  },
  {
    "label": "Teleporters Discovered:",
    "dataPath": ["statistics", "discoveries", "mechanical/teleporter"]
  },
  {
    "label": "Trees Mined:",
    "dataPath": ["statistics", "trees_mined"]
  },
  {
    "label": "Undertakings:",
    "dataPath": ["statistics", "undertakings"]
  }
] satisfies (AccomplishmentsSectionItem & { "label": string, "dataPath": [AllFirstPathSegment, ...string[]] })[]

function killsIn(data): [string, number][] {
    return data?.statistics?.kills ? Object.entries(data.statistics.kills) : []
}

function discoveriesIn(data): [string, number][] {
    return data?.statistics?.discoveries ? Object.entries(data.statistics.discoveries) : []
}

const sumOfCategory = (category: string) => entries => {
    return entries.reduce((s, e) => (e[0].startsWith(category) ? s + e[1] : s), 0)
}

const sumIncluding = (pattern: string) => entries => {
    return entries.reduce((s, e) => (e[0].includes(pattern) ? s + e[1] : s), 0)
}

const Computations = {
    automata_killed: [killsIn, sumOfCategory("automata/")],
    brains_killed: [killsIn, sumOfCategory("brains/")],
    creatures_killed: [killsIn, sumOfCategory("creatures/")],
    supernatural_killed: [killsIn, sumIncluding("revenant")],
    expiator_parts_discovered: [discoveriesIn, sumOfCategory("hell/expiator")],
    purifier_parts_discovered: [discoveriesIn, sumOfCategory("mechanical/geck")],
} as const satisfies { [key: string]: [ (data: any) => [string, number][], (entries: [string, number][]) => number ] }

type AllFirstPathSegment = "computed" | "statistics"
type GenericSectionItem = {
    label: string,
    dataPath: string[],
}
type AccomplishmentsSectionItem = {
    label: string,
    dataPath: ["computed", keyof typeof Computations] | [Exclude<AllFirstPathSegment, "computed">, ...string[]],
}

function Section(sectionConfig: GenericSectionItem[], columns: (item: GenericSectionItem) => string) {
    const main = sectionConfig.map((item) => `<tr>${columns(item)}</tr>`).join("")
    return `<table><tbody>${main}</tbody></table>`
}

function Kills(data) {
  if (!data.statistics?.kills) return ""
  let result = ""
  for (const id of SortedEntityIds) {
    const numKills = data.statistics.kills[id]
    if (numKills) {
      result += `<tr><td>${EntityTitles[id]}:</td><td>${typeof numKills == "number" ? formatNumber(numKills) : numKills}</td></tr>`
    }
  }
  return result
}

function Layout(columns: (item: GenericSectionItem) => string) {return `
<main class="mx-auto max-w-5xl">
<table class="w-full">
<tbody>
<tr>
<td class="p-4 align-top">
<section class="my-4 border-stats body-font bg-blue-950 text-white title-font">${Section(VitalsSection, columns)}</section>
</td>
<td class="p-4 align-top">
<section class="my-4 border-stats body-font bg-blue-950 text-white title-font">${Section(AccomplishmentsSection, columns)}</section>
<section class="my-4 border-stats body-font bg-blue-950 text-white title-font">
<table>
<tbody id="Kills">
</tbody>
</table>
</section>
</td>
</tr>
</tbody>
</table>
</main>
`
}

const PendingRowAnimation = `<td><div class="pending-row-animation"></div></td>`

export function Pending() {
    return Layout(() => PendingRowAnimation)
}

export function Scaffolding() {
    return Layout(row => `<td>${row.label}</td><td id="${row.label}" class="px-4"></td>`)
}

function formatNumber(n : number) {
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

export function collectData(data, config: GenericSectionItem[], result) {
    for (const item of config) {
        let finger = data
        for (const segment of item.dataPath) {
            finger = finger[segment];
        }
        result[item.label] = typeof finger === "number" ? formatNumber(finger) : finger
    }
}
export function Data(data) {
    if (!data.computed) {
        data.computed = {}
        for (const [k, v] of Object.entries(Computations)) {
            let finger = data;
            for (const step of v) {
                finger = step(finger)
            }
            data.computed[k] = finger
        }
    }
    const result = {}
    collectData(data, VitalsSection, result)
    collectData(data, AccomplishmentsSection, result)
    result["Kills"] = Kills(data)
    return result
}
