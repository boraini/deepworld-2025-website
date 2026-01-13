imagePath = ""
fileProps = {
    "size": "2048, 4096"
}
sprites = []
props = fileProps
with open("characters-animated+hd2.atlas.txt") as f:
    firstlineread = False
    for line in f:
        if not firstlineread:
            imagePath = line.strip()
            firstlineread = True
            continue
        if ":" in line:
            kv = line.split(":")
            props[kv[0].strip()] = kv[1].strip()
        else:
            props = {
                "name": line.strip()
            }
            sprites.append(props)

with open("characters-animated+hd2.atlas", "w") as f:
    print(imagePath, file = f)
    for (k, v) in fileProps.items():
        print(f"    {k}: {v}", file = f)

    for sprite in sprites:
        print(sprite["name"], file = f)

        x, y = [int(a) for a in sprite["xy"].split(",")]
        w, h = [int(a) for a in sprite["orig"].split(",")]
        x_end, y_end = [int(a) for a in sprite["offset"].split(",")]
        w_end, h_end = [int(a) for a in sprite["size"].split(",")]
        print(f"    bounds: {x}, {y}, {w_end}, {h_end}", file = f)
        print(f"    offsets: {x_end}, {y_end}, {w}, {h}", file = f)
