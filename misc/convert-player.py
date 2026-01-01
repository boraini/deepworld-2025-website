import json

data = None
with open("player.json.txt") as f:
    data = json.load(f)

if data == None:
    print("Cannot be loaded!")

# v4 has a list instead of kv pairs for skins
processed_skins = []
for skin in data["skins"]:
    processed_skins.append({ "name": skin, "attachments": data["skins"][skin] })             
data["skins"] = processed_skins

# v4 spine has angle renamed to value in animations
for animation in data["animations"]:
    if "bones" in data["animations"][animation]:
        for bone in data["animations"][animation]["bones"]:
            if "rotate" in data["animations"][animation]["bones"][bone]:
                for step in data["animations"][animation]["bones"][bone]["rotate"]:
                    if "angle" in step:
                        step["value"] = step["angle"]
                        del step["angle"]

with open("player.json", "w") as f:
    json.dump(data, f)
