export function Scaffolding(message: string, details: string | null, stackTrace?: string | undefined) {
    const top = `
<main class="mx-auto my-4 border-stats max-w-5xl bg-blue-950 text-white markdown">
<h1 class="text-brass" style="margin-top: calc(4 * var(--spacing))">${message}</h1>
<p>
${details ?? "Please try refreshing the page, or contact the developers on Discord."}
</p>
    `
    const middle = stackTrace ? `<h2>Error Details</h2><pre class="my-2 p-2 border border-white rounded-2xl"><code>${stackTrace}</code></pre>` : ""
    const bottom = "</main>"

    return top + middle + bottom;
}