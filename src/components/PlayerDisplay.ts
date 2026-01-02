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
            if (appearance) {
                const attachments = resolveAttachments(appearance)
                player.skeleton.slots.forEach((slot) => {
                    const slotKey = slot.data.name
                    if (slotKey in attachments) {
                        console.log(
                            "replacing slot " +
                                slotKey +
                                " with " +
                                attachments[slotKey]
                        )
                        console.log(
                            player.skeleton.getAttachmentByName(
                                slotKey,
                                attachments[slotKey]
                            )
                        )
                        slot.setAttachment(
                            player.skeleton.getAttachment(
                                slot.data.index,
                                attachments[slotKey]
                            )
                        )
                        slot.attachmentState
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
                player.skeleton.update(0)
            }
        },
    })

    return spinePlayers[id]
}

type Appearance = Record<string, string>

const itemSpriteOverrides = {
    "prosthetics/brass-legs": "prosthetics/brass",
    "prosthetics/diamond-legs": "prosthetics/diamond",
    "prosthetics/onyx-legs": "prosthetics/onyx",
}

const skinSlots: Record<string, Record<string, string>> = {
    fw: {
        "-foot-lower": "-foot-lower",
        "-foot-upper": "-foot-upper",
    },
    fg: {
        "-facialgear": "-facialgear",
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
}

const coloredHair = ["-hair", "-facial-hair"].map((t) => "character" + t)
const coloredSkin = ["-head", "-eye", "-hand", "-hand1"].map(
    (t) => "character" + t
)

function resolveAttachments(appearance: Record<string, string>) {
    const result: Record<string, string> = {}
    for (let appearanceKey in appearance) {
        const itemId = appearance[appearanceKey]

        const itemSprite = itemSpriteOverrides[itemId] ?? itemId
        for (let characterSuffix in skinSlots[appearanceKey] ?? []) {
            const itemSuffix = skinSlots[appearanceKey][characterSuffix]
            result["character" + characterSuffix] = itemSprite + itemSuffix
        }
    }

    return result
}
