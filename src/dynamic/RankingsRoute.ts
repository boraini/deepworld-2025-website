import { formatNumber } from "./common";

type RowDataType = [string, number]
function Section(expectedNumberOfItems: number, component: (row: RowDataType, index: number) => string, data?: RowDataType[]) {
    let result = `<table class="box-border w-full"><tbody>`;

    if (data) {
        for (let i = 0; i < data.length; i++) {
            result += component(data[i], i)
        }
    } else {
        for (let i = 0; i < expectedNumberOfItems; i++) {
            result += component(null, i)
        }
    }

    result += "</tbody></table>"
    return result 
}

const ExpectedNumberOfItems = 50
function Layout(component: (item: any, index: number) => string, data?: { items_mined: RowDataType[], items_placed: RowDataType[], items_crafted: RowDataType[] }) {return `

  <div class="flex flex-col md:flex-row">
    <section class="m-4 mb-0 grow border-stats body-font bg-blue-950 text-white title-font">
      <h2 class="text-brass" style="margin-top: calc(4 * var(--spacing));">Items Mined</h2>
      ${Section(ExpectedNumberOfItems, component, data?.items_mined)}
    </section>
    <section class="m-4 mb-0 grow border-stats body-font bg-blue-950 text-white title-font">
    <h2 class="text-brass" style="margin-top: calc(4 * var(--spacing));">Items Placed</h2>
      ${Section(ExpectedNumberOfItems, component, data?.items_placed)}
    </section>
    <section class="m-4 mb-0 grow border-stats body-font bg-blue-950 text-white title-font">
      <h2 class="text-brass" style="margin-top: calc(4 * var(--spacing));">Items Crafted</h2>
      ${Section(ExpectedNumberOfItems, component, data?.items_crafted)}
    </section>
  </div>
`
}

function PageLayout(content) { return `
<main class="mx-auto my-4 max-w-5xl markdown" id="rankings">
  ${content}
</main>
`
}

const PendingRowAnimation = `<td><div class="pending-row-animation"></div></td>`

export function Pending() {
    return PageLayout(Layout(() => PendingRowAnimation))
}

export function Scaffolding() {
    return PageLayout("")
}

export function Data(data) {
    return { "rankings": Layout((row, index) => `<tr><td>${index + 1}&nbsp;-</td><td class="max-w-1/2 text-gold"><a href="./players/${row[0]}">${row[0]}</a></td><td>${formatNumber(row[1])}</td></tr>`, data) }
}
