import json

data = None
with open("config-items.json") as f:
    data = json.load(f)

items = data["items"]

result = {}

for itemId in items:
    itemConfig = items[itemId]
    if itemConfig.get("appearance") or itemConfig.get("wardrobe") or (itemConfig.get("use") or {}).get("fly"):
        itemSprite = itemConfig.get("spine_sprite") or itemConfig.get("sprite") or itemId

        if itemId != itemSprite:
            result[itemId] = itemSprite

with open("different-items.json", "w") as f:
    json.dump(result, f)