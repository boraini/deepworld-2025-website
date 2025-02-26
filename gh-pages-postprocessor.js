export function ghPagesPostprocessor() {
    return {
        name: "gh-pages-postprocessor",
        enforce: "post",
        apply: "build",
        generateBundle(error) {
            this.emitFile({
                type: 'asset',
	            fileName: ".nojekyll",
	            source: "\n",
            });
        },
    };
}
