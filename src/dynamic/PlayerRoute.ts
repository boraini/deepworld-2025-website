import { playerApi, proxied } from "./common"
import { activatePlayerDisplay } from "@components/PlayerDisplay.js"

export { PlayerRoute as Component } from "./HandlebarsRoutes"

// prettier-ignore
const EntityTitles = {"avatar":"Player","ghost":"Ghost","revenant":"Revenant","dire-revenant":"Dire Revenant","revenant-lord":"Revenant Lord","terrapus/child":"Juvenile Terrapus","terrapus/adult":"Adult Terrapus","terrapus/racing":"Racing Terrapus","terrapus/pet":"Pet Terrapus","terrapus/fire":"Fire Terrapus","terrapus/acid":"Acid Terrapus","terrapus/skeleton":"Skeleton Terrapus","terrapus/frost":"Frost Terrapus","terrapus/queen":"Queen Terrapus","creatures/rat":"Rat","creatures/skunk":"Skunk","creatures/skunk-pet":"Pet Skunk","creatures/armadillo":"Armadillo","creatures/roach":"Roach","creatures/roach-large":"Large Roach","creatures/bunny-ice":"Bunny","creatures/bunny-ice-pet":"Pet Bunny","creatures/crow":"Crow","creatures/crow-auto":"Cyborg Crow","creatures/crow-pet":"Pet Crow","creatures/vulture":"Vulture","creatures/vulture-pet":"Pet Vulture","creatures/bluejay":"Bluejay","creatures/cardinal":"Cardinal","creatures/seagull":"Seagull","creatures/butterfly-monarch":"Monarch Butterfly","creatures/butterfly-papilio-ulysses":"Papilio Ulysees Butterfly","creatures/butterfly-swallowtail":"Swallowtail Butterfly","creatures/butterfly-green":"Green Butterfly","creatures/butterfly-moth":"Moth","creatures/butterfly-owl":"Owl Butterfly","creatures/butterfly-paper-kite":"Paper Kite Butterfly","creatures/butterfly-rumanzovia":"Rumanzovia Butterfly","creatures/scorpion":"Scorpion","creatures/scorpion-large":"Large Scorpion","creatures/bat":"Bat","creatures/bat-auto":"Cyborg Bat","creatures/sandworm":"Sand Worm","creatures/snowworm":"Arctic Worm","creatures/tentacle":"Tentacle Monster","ground/geyser-small":"Geyser","desert/sandstorm":"Sand Storm","automata/android":"Android","automata/cat":"Android Cat","automata/dog":"Android Dog","automata/butler-brass":"Brass Butler Bot","automata/butler-diamond":"Diamond Butler Bot","automata/butler-onyx":"Onyx Butler Bot","automata/tiny":"Tiny Automata","automata/small":"Small Automata","automata/medium":"Medium Automata","automata/large":"Large Automata","brains/tiny-crawler":"Baby Crawler Brain","brains/tiny-flyer":"Baby Flyer Brain","brains/small":"Juvenile Brain","brains/medium":"Adult Brain","brains/medium-dire":"Dire Adult Brain","brains/large":"Brain Lord","aquatic/clownfish":"Clownfish","aquatic/flame-hawkfish":"Flame Hawkfish","aquatic/sergeant-major":"Sergeant Major Fish","aquatic/almaco-jack":"Almaco Jack Fish","aquatic/angelfish":"Angelfish","aquatic/codfish":"Codfish","aquatic/herring":"Herring Fish","aquatic/piranha":"Piranha","aquatic/anemone-red":"Red Anemone","aquatic/anemone-magenta":"Magenta Anemone","aquatic/anemone-electric":"Electric Anemone"}
const SortedEntityIds = Object.keys(EntityTitles).sort((a, b) =>
    EntityTitles[a] < EntityTitles[b] ? -1 : 1
)

const VitalsSection = [
    //   {
    //     "label": "Joined",
    //     "dataPath": ""
    //   },
    {
        label: "Level:",
        dataPath: ["level"],
    },
    {
        label: "Skill Level:",
        dataPath: ["skill_level"],
    },
    {
        label: "Items Mined:",
        dataPath: ["items_mined"],
    },
    {
        label: "Items Placed:",
        dataPath: ["items_placed"],
    },
    {
        label: "Items Crafted:",
        dataPath: ["items_crafted"],
    },
    {
        label: "Deaths:",
        dataPath: ["deaths"],
    },
]

const AccomplishmentsSection = [
    //   {
    //     "label": "Animals Trapped:",
    //     "dataPath": "108"
    //   },
    {
        label: "Areas Discovered:",
        dataPath: ["statistics", "areas_explored"],
    },
    {
        label: "Automata Killed:",
        dataPath: ["computed", "automata_killed"],
    },
    {
        label: "Brains Killed:",
        dataPath: ["computed", "brains_killed"],
    },
    {
        label: "Chests Looted:",
        dataPath: ["statistics", "containers_looted"],
    },
    {
        label: "Creatures Killed:",
        dataPath: ["computed", "creatures_killed"],
    },
    //   {
    //     "label": "Creatures Maimed:",
    //     "dataPath": "4,779"
    //   },
    {
        label: "Deliverances:",
        dataPath: ["statistics", "deliverances"],
    },
    {
        label: "Dungeons Raided:",
        dataPath: ["statistics", "dungeons_raided"],
    },
    {
        label: "Infernal Parts Discovered:",
        dataPath: ["computed", "expiator_parts_discovered"],
    },
    //   {
    //     "label": "Inhibitors Activated:",
    //     "dataPath": "101"
    //   },
    {
        label: "Landmarks Upvoted:",
        dataPath: ["statistics", "landmarks_upvoted"],
    },
    {
        label: "Maws Plugged:",
        dataPath: ["statistics", "maws_plugged"],
    },
    {
        label: "Minerals Mined:",
        dataPath: ["statistics", "minerals_mined"],
    },
    {
        label: "Players Killed:",
        dataPath: ["statistics", "players_killed"],
    },
    {
        label: "Purifier Parts Discovered:",
        dataPath: ["computed", "purifier_parts_discovered"],
    },
    {
        label: "Supernatural Killed:",
        dataPath: ["computed", "supernatural_killed"],
    },
    {
        label: "Teleporters Discovered:",
        dataPath: ["statistics", "discoveries", "mechanical/teleporter"],
    },
    {
        label: "Trees Mined:",
        dataPath: ["statistics", "trees_mined"],
    },
    {
        label: "Undertakings:",
        dataPath: ["statistics", "undertakings"],
    },
] satisfies (AccomplishmentsSectionItem & {
    label: string
    dataPath: [AllFirstPathSegment, ...string[]]
})[]

function killsIn(data): [string, number][] {
    return data?.statistics?.kills ? Object.entries(data.statistics.kills) : []
}

function discoveriesIn(data): [string, number][] {
    return data?.statistics?.discoveries
        ? Object.entries(data.statistics.discoveries)
        : []
}

const sumOfCategory = (category: string) => (entries) => {
    return entries.reduce(
        (s, e) => (e[0].startsWith(category) ? s + e[1] : s),
        0
    )
}

const sumIncluding = (pattern: string) => (entries) => {
    return entries.reduce((s, e) => (e[0].includes(pattern) ? s + e[1] : s), 0)
}

const Computations = {
    automata_killed: [killsIn, sumOfCategory("automata/")],
    brains_killed: [killsIn, sumOfCategory("brains/")],
    creatures_killed: [killsIn, sumOfCategory("creatures/")],
    supernatural_killed: [killsIn, sumIncluding("revenant")],
    expiator_parts_discovered: [discoveriesIn, sumOfCategory("hell/expiator")],
    purifier_parts_discovered: [
        discoveriesIn,
        sumOfCategory("mechanical/geck"),
    ],
} as const satisfies {
    [key: string]: [
        (data: any) => [string, number][],
        (entries: [string, number][]) => number,
    ]
}

type AllFirstPathSegment = "computed" | "statistics"
export type GenericSectionItem = {
    label: string
    dataPath: string[]
}
export type AccomplishmentsSectionItem = {
    label: string
    dataPath:
        | ["computed", keyof typeof Computations]
        | [Exclude<AllFirstPathSegment, "computed">, ...string[]]
}

export function placeholderLoader() {
    return {
        vitals: {
            config: VitalsSection,
            ExpectedNumberOfItems: VitalsSection.length,
        },
        accomplishments: {
            config: AccomplishmentsSection,
            ExpectedNumberOfItems: AccomplishmentsSection.length,
        },
        kills: {
            SortedEntityIds: SortedEntityIds,
            EntityTitles: EntityTitles,
            ExpectedNumberOfItems: Object.keys(EntityTitles).length,
        },
    }
}
export async function loader({ username }, { onError }) {
    // Start loading things
    const dataPromise = await fetch(
        proxied(`${playerApi}/players/${username}`)
    ).then(async (r) => {
        if (r.ok) {
            return await r.json()
        } else {
            return {
                message: "Error occurred while fetching data.",
                stackTrace: await r.text(),
            }
        }
    })

    if (window && !window.spineScript) {
        window.spineScript = new Promise((resolve, reject) => {
            const ORIGIN =
                "https://v2202410239072292297.goodsrv.de:6443/player-spine"
            const spineScript = document.createElement("script")
            spineScript.src = `${ORIGIN}/spine-player.min.js`
            document.head.appendChild(spineScript)
            spineScript.onload = resolve
            spineScript.onerror = reject
        })
    }

    // Finish loading things
    const [data] = await Promise.all([dataPromise, window.spineScript])

    data.computed ??= {}
    Object.entries(Computations).forEach(([key, computation]) => {
        data.computed[key] = computation.reduce((acc, fn) => fn(acc), data)
    })

    return {
        ...placeholderLoader(),
        data: await dataPromise,
    }
}
export async function HeaderConfig({ username }: { username: string }) {
    return {
        title: username,
        backlink: `../../players`,
    }
}

export async function onload(loaderData) {
    activatePlayerDisplay("player-container", loaderData.data.appearance)
}
