const spinePlayers: typeof window.spinePlayers = {}
if (window) window.spinePlayers = spinePlayers

export async function preprocessSkeletonJson(url: string) {
    const preprocessedSkeleton = await fetch(url).then((r) => r.json())

    const skins = []
    if (
        preprocessedSkeleton.skins &&
        !Array.isArray(preprocessedSkeleton.skins)
    )
        for (const k in preprocessedSkeleton.skins) {
            preprocessedSkeleton.skins[k].name = k
            skins.push(preprocessedSkeleton.skins[k])
        }

    preprocessedSkeleton.skins = skins

    return (
        "data:application/json;base64," +
        btoa(JSON.stringify(preprocessedSkeleton))
    )
}

export function activatePlayerDisplay(id: string, appearance: Appearance) {
    const ORIGIN = "https://v2202410239072292297.goodsrv.de:6443/player-spine"

    spinePlayers[id] ??= new spine.SpinePlayer(id, {
        skeleton: `${ORIGIN}/player.json`,
        atlas: `${ORIGIN}/characters-animated+hd2.atlas`,
        scale: 1,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
        skin: "default",
    })

    return spinePlayers[id]
}
