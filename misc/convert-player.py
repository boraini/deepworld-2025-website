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

def convert_angle(degrees):
    return degrees if degrees <= 180 else degrees - 360
# v4 spine has angle renamed to value in animations
for animation in data["animations"]:
    if "bones" in data["animations"][animation]:
        for bone in data["animations"][animation]["bones"]:
            if "rotate" in data["animations"][animation]["bones"][bone]:
                for step in data["animations"][animation]["bones"][bone]["rotate"]:
                    if "angle" in step:
                        step["value"] = convert_angle(step["angle"])
                        del step["angle"]

def lerp(a, b, t):
    return a * (1 - t) + b * t
# v4 rotations are absolute
for animation in data["animations"]:
    if "bones" in data["animations"][animation]:
        for bone in data["animations"][animation]["bones"]:
            if "rotate" in data["animations"][animation]["bones"][bone]:
                track = data["animations"][animation]["bones"][bone]["rotate"]
                for i in range(len(track)):
                    currentFrame = track[i]
                    if "curve" in currentFrame and isinstance(currentFrame["curve"], list):
                        nextFrame = track[i + 1]
                        t0, angle0, t1, angle1 = currentFrame["curve"]
                        currentFrame["curve"] = [
                            lerp(currentFrame["time"], nextFrame["time"], t0),
                            lerp(currentFrame["value"], nextFrame["value"], angle0),
                            lerp(currentFrame["time"], nextFrame["time"], t1),
                            lerp(currentFrame["value"], nextFrame["value"], angle1),
                        ]
            if "translate" in data["animations"][animation]["bones"][bone]:
                track = data["animations"][animation]["bones"][bone]["translate"]
                for i in range(len(track)):
                    currentFrame = track[i]
                    if "curve" in currentFrame and isinstance(currentFrame["curve"], list):
                        nextFrame = track[i + 1]
                        if len(currentFrame["curve"]) != 4:
                            print(f"translate curve for {animation}[{i}] had a length {len(currentFrame["curve"])}")
                            continue
                        t0, v0, t1, v1 = currentFrame["curve"]
                        currentFrame["curve"] = [
                            lerp(currentFrame["time"], nextFrame["time"], t0),
                            lerp(currentFrame["x"], nextFrame["x"], v0),
                            lerp(currentFrame["time"], nextFrame["time"], t0),
                            lerp(currentFrame["y"], nextFrame["y"], v0),
                            lerp(currentFrame["time"], nextFrame["time"], t1),
                            lerp(currentFrame["x"], nextFrame["x"], v1),
                            lerp(currentFrame["time"], nextFrame["time"], t1),
                            lerp(currentFrame["y"], nextFrame["y"], v1),
                        ]

with open("player.json", "w") as f:
    json.dump(data, f)
