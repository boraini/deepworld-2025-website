import { visit } from "unist-util-visit"
import path from "node:path"
import pathPosix from "node:path/posix"

export function linkResolver({
    base: confBase,
    root: confRoot,
    customPrefixes: confCustomPrefixes,
    resolution,
}) {
    const confBaseUrl = makeBaseUrl(confBase)

    return function linkResolverPlugin(tree, file) {
        let base = confBase;
        let root = confRoot;
        let customPrefixes = confCustomPrefixes;

        let currentPath = ".";
        if (file.history.length > 0) {
            const filePath = file.history[0];
            const matches = /[^\/](\.[a-zA-Z0-9]+)$/.exec(filePath);
            currentPath = matches ? filePath.substring(0, filePath.length - matches[1].length) : filePath
        }

        for (let rootPath in resolution) {
            if (isRelative(rootPath, currentPath)) {
                root = rootPath
                const myResolution = resolution[rootPath]
                if (myResolution.base) {
                    base = myResolution.base.startsWith("/") ? myResolution.base : pathPosix.join(base, myResolution.base)
                }
                if (myResolution.customPrefixes) customPrefixes = myResolution.customPrefixes
                break;
            }
        }

        const baseUrl = makeBaseUrl(base)

        visit(tree, "link", node => {
            // Nothing to do
            if (!node.url) return;

            // URL with origin - nothing to do
            if (node.url.startsWith("http://") || node.url.startsWith("https://") || node.url.startsWith("//")) return;

            // Absolute URL
            if (node.url.startsWith("/")) {
                node.url = new URL("." + node.url, confBaseUrl).pathname
                return;
            }

            // Custom Prefix
            if (customPrefixes) for (const prefix in customPrefixes) {
                if (prefix.endsWith("/") ? node.url.startsWith(prefix) : node.url.startsWith(prefix + "/")) {
                    let stripped = node.url.substring(prefix.length)
                    if (stripped.startsWith("/")) {
                        stripped = stripped.substring(1)
                        if (stripped.startsWith("/")) {
                            console.warn("Absolute URL found after prefix! " + node.url);
                            node.url = "#"
                            return;
                        }
                    }
                    node.url = new URL(stripped, baseUrl).pathname
                    return;
                }
            }

            // Relative URL
            const myPath = path.relative(root, path.resolve(currentPath, node.url))
            node.url = new URL(myPath, baseUrl).pathname
        })
    }
}

function isRelative(parent, dir) {
    const relative = path.relative(parent, dir);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function makeBaseUrl(base) {
    let baseUrl = base

    if (!/^https?:\/\//.test(base)) {
        baseUrl = base.startsWith("/") ? "http://localhost" + base : "http://localhost/" + base;
    }

    if (!baseUrl.endsWith("/")) {
        baseUrl += "/"
    }

    return baseUrl
}