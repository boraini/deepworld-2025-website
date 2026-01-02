import type { SpinePlayer, Color } from "@esotericsoftware/spine-player"

declare global {
  var spineScript: Promise<any>
  var spinePlayers: Record<string, SpinePlayer>
  var spine: {
    SpinePlayer: typeof SpinePlayer
    Color: typeof Color
  }
}
