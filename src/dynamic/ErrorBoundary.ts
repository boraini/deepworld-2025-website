export function Scaffolding(message: string, details: string | null, stackTrace?: string | undefined) {
    const top = `
<main class="mx-auto border-stats markdown max-w-5xl">
<h1>${message}</h1>
<p>
${details ?? "Please try refreshing the page, or contact the developers on Discord."}
</p>
    `
    const middle = stackTrace ? `<code>${stackTrace}</code>` : ""
    const bottom = "</main>"

    return top + middle + bottom;
}