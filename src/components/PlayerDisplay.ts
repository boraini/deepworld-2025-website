const spinePlayers: typeof window.spinePlayers = {}
if (window) window.spinePlayers = spinePlayers

export function activatePlayerDisplay(id: string, appearance: Appearance) {
    const ORIGIN = "https://v2202410239072292297.goodsrv.de:6443/player-spine"

    spinePlayers[id] ??= new spine.SpinePlayer(id, {
        skeleton: `${ORIGIN}/player.json`,
        atlas: `${ORIGIN}/characters-animated+hd2.atlas`,
        scale: 1,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
        success(player) {
            // Setting an animation is needed to initialize the model update procedure or something
            player.setAnimation("idle-1")
            requestAnimationFrame(() => player.pause())
            if (appearance) {
                const [attachments, colors] = resolveAttachments(appearance)
                player.skeleton.slots.forEach((slot) => {
                    const slotKey = slot.data.name
                    if (slotKey in attachments) {
                        if (!attachments[slotKey]) {
                            player.skeleton.setAttachment(slotKey, null)
                            return
                        }

                        const attachment = player.skeleton.getAttachment(
                            slot.data.index,
                            attachments[slotKey]
                        )

                        if (attachment) {
                            player.skeleton.setAttachment(
                                slotKey,
                                attachments[slotKey]
                            )
                            if (slotKey in colors) {
                                slot.color = spine.Color.fromString(
                                    colors[slotKey]
                                )
                            }
                        } else {
                            console.error(
                                `Attachment not found! ${attachments[slotKey]}`
                            )
                        }
                    }

                    if (coloredHair.includes(slotKey)) {
                        slot.color.setFromString(appearance["h*"] + "FF")
                        console.log(
                            "hair color on " +
                                slotKey +
                                "" +
                                JSON.stringify(slot.color)
                        )
                    }

                    if (coloredSkin.includes(slotKey)) {
                        slot.color.setFromString(appearance["c*"] + "FF")
                        console.log(
                            "skin color on " +
                                slotKey +
                                "" +
                                JSON.stringify(slot.color)
                        )
                    }
                })

                player.skeleton.updateCache()
            }
        },
    })

    return spinePlayers[id]
}

type Appearance = Record<string, string>

const itemSpriteOverrides = {
    "headgear/tophat-brown": "headgear/tophat",
    "headgear/bowlerhat-black": "headgear/bowlerhat",
    "headgear/newsie-hat-gray": "headgear/newsie-hat",
    "headgear/winter-hat-brown": "headgear/winter-hat",
    "footwear/shoes": "footwear/shoe",
    "bottoms/clown": "bottoms/clown-leg",
    "bottoms/royal": "bottoms/royal-leg",
    "bottoms/brain": "bottoms/brain-leg",
    "bottoms/brass": "bottoms/brass-leg",
    "bottoms/plant": "bottoms/plant-leg",
    "bottoms/samaurai": "bottoms/samaurai-leg",
    "bottoms/watermelon": "bottoms/watermelon-leg",
    "bottoms/pajamas": "bottoms/pajamas-leg",
    "bottoms/valkyrie": "bottoms/valkyrie-leg",
    "bottoms/karate": "bottoms/karate-leg",
    "bottoms/diving-suit": "bottoms/diving-suit-leg",
    "bottoms/android": "bottoms/android-leg",
    "prosthetics/brass-legs": "prosthetics/brass",
    "prosthetics/diamond-legs": "prosthetics/diamond",
    "prosthetics/onyx-legs": "prosthetics/onyx",
}

function getItemSprite(appearanceKey, itemId) {
    const override = itemSpriteOverrides[itemId]
    if (override) {
        return override
    }
    if (appearanceKey == "fw") return "footwear/shoe"
    if (appearanceKey == "b" && itemId.startsWith("bottoms/dress"))
        return "bottoms/dress"
    if (
        appearanceKey == "b" &&
        !["dress", "skirt", "tutu"].some((substr) => itemId.includes(substr))
    )
        return "bottoms/pants"
    const jetpackPrefix = "accessories/jetpack"
    if (appearanceKey == "u" && itemId.startsWith(jetpackPrefix)) {
        return "avatar/jetpack" + itemId.substring(jetpackPrefix.length)
    }

    return itemId
}

const skinSlots: Record<string, Record<string, string>> = {
    fw: {
        "-foot-lower": "-lower",
        "-foot-upper": "-upper",
    },
    fg: {
        "-facialgear": "",
    },
    fh: {
        "-facialhair": "",
    },
    b: {
        "-leg-lower": "-lower",
        "-leg-lower1": "-lower",
        "-leg-upper": "-upper",
        "-leg-upper1": "-upper",
    },
    t: {
        "-arm-upper": "-arm-upper",
        "-arm-upper1": "-arm-upper",
        "-arm-lower": "-arm-lower",
        "-arm-lower1": "-arm-lower",
        "-torso": "",
    },
    h: {
        "-hair": "",
    },
    hg: {
        "-headgear": "",
    },
    to: {
        "-exo-torso": "",
        "-exo-arm-upper": "-arm-upper",
        "-exo-arm-upper2": "-arm-upper",
        "-exo-arm-lower": "-arm-lower",
        "-exo-arm-lower2": "-arm-lower",
        "-hand": "-hand",
        "-hand1": "-hand",
        "-exo-hand": "-hand",
        "-exo-hand2": "-hand",
    },
    lo: {
        "-exo-leg-upper": "-leg-upper",
        "-exo-leg-upper2": "-leg-upper",
        "-exo-leg-lower": "-leg-lower",
        "-exo-leg-lower2": "-leg-lower",
        "-exo-foot-upper": "-foot-upper",
        "-exo-foot-upper2": "-foot-upper",
        "-exo-foot-lower": "-foot-lower",
        "-exo-foot-lower2": "-foot-lower",
    },
}

const coloredHair = ["-hair", "-facial-hair"].map((t) => "character" + t)
const coloredSkin = ["-head", "-eye", "-hand", "-hand1"].map(
    (t) => "character" + t
)

function resolveAttachments(appearance: Record<string, string>) {
    const result: Record<string, string> = {}
    const colors: Record<string, string> = {}
    for (let appearanceKey in appearance) {
        if (appearanceKey === "u") {
            result["suit"] = getItemSprite("u", appearance["u"])
        }
        if (
            appearanceKey === "b" &&
            resolveBottomAttachments(appearance, result, colors)
        )
            continue
        const itemId = appearance[appearanceKey]

        const itemSprite = getItemSprite(appearanceKey, itemId)
        for (let characterSuffix in skinSlots[appearanceKey] ?? []) {
            let value: string | null = null
            if (itemSprite != "air") {
                const itemSuffix = skinSlots[appearanceKey][characterSuffix]
                value = itemSprite + itemSuffix
            }
            result["character" + characterSuffix] = value
            const slotColor = appearance[appearanceKey + "*"]
            if (slotColor) {
                colors["character" + characterSuffix] = slotColor
            }
        }
    }

    return [result, colors]
}

function resolveBottomAttachments(appearance, result, colors) {
    if (appearance["b"] == "air") return false
    const dress = appearance["b"].includes("dress")
    const skirt = appearance["b"].includes("skirt")
    const tutu = !skirt && appearance["b"].includes("tutu")

    // Skirted Clothing
    if (dress || skirt || tutu) {
        const itemSprite = getItemSprite("b", appearance["b"])
        ;(tutu ? ["-m"] : ["-l", "-m", "-r"]).forEach((characterSuffix) => {
            result["character-skirt" + characterSuffix] =
                itemSprite + characterSuffix
            if (dress && appearance["b*"]) {
                colors["character-skirt" + characterSuffix] = appearance["b*"]
            }
        })
        return true
    }

    return false
}
