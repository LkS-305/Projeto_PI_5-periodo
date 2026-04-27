import Chart, { type ChartTypeRegistry, type Plugin } from "chart.js/auto";

type InteractiveChartParams = {
  canvas: HTMLCanvasElement;
  labels: string[];
  values: number[];
  comparisonValues?: number[];
  max: number;
  borderColor?: string;
  showXAxis?: boolean;
  showYAxis?: boolean;
  tooltipTitle?: string;
  formatValue?: (value: number) => string;
  getComparisonDateLabel: () => string;
  getCurrentPointLabel?: (label: string, index: number) => string;
  getComparisonPointLabel?: (label: string, index: number) => string;
};

const verticalLinePlugin: Plugin<"line"> = {
  id: "domi-vertical-line",
  afterDatasetsDraw(chart) {
    const activeElements = chart.tooltip?.getActiveElements();

    if (!activeElements || activeElements.length === 0) {
      return;
    }

    const {
      ctx,
      chartArea: { top, bottom },
    } = chart;

    const x = activeElements[0].element.x;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e0c271";
    ctx.stroke();
    ctx.restore();
  },
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrentDate(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrentTime(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ensureTooltipElement(chart: Chart): HTMLDivElement {
  const parent = chart.canvas.parentNode as HTMLElement;

  if (!parent) {
    throw new Error("Chart container not found");
  }

  if (getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }

  let tooltipEl = parent.querySelector(
    ".chart-hover-tooltip",
  ) as HTMLDivElement | null;

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "chart-hover-tooltip";
    parent.appendChild(tooltipEl);
  }

  return tooltipEl;
}

export function createInteractiveLineChart({
  canvas,
  labels,
  values,
  comparisonValues,
  max,
  borderColor = "#e0c271",
  showXAxis = true,
  showYAxis = true,
  tooltipTitle = "Valor liquido",
  formatValue = formatCurrency,
  getComparisonDateLabel,
  getCurrentPointLabel,
  getComparisonPointLabel,
}: InteractiveChartParams): Chart<keyof ChartTypeRegistry> {
  const safeComparisonValues = comparisonValues ?? values;

  return new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          data: values,
          borderColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.35,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: ({ chart, tooltip }) => {
            const tooltipEl = ensureTooltipElement(chart);

            if (tooltip.opacity === 0 || !tooltip.dataPoints.length) {
              tooltipEl.style.opacity = "0";
              return;
            }

            const point = tooltip.dataPoints[0];
            const index = point.dataIndex;
            const label = String(labels[index] ?? "");
            const currentValue = Number(values[index] ?? 0);
            const previousValue = Number(safeComparisonValues[index] ?? 0);

            const currentDate = formatCurrentDate();
            const sameHour = label.includes(":") ? label : formatCurrentTime();
            const comparisonDate = getComparisonDateLabel();
            const currentPointLabel = getCurrentPointLabel
              ? getCurrentPointLabel(label, index)
              : `${currentDate} ${sameHour}`;
            const comparisonPointLabel = getComparisonPointLabel
              ? getComparisonPointLabel(label, index)
              : `${comparisonDate} ${sameHour}`;

            tooltipEl.innerHTML = `
              <p class="chart-hover-tooltip__title">${tooltipTitle}</p>
              <p class="chart-hover-tooltip__line">
                <span>${currentPointLabel}</span>
                <strong>${formatValue(currentValue)}</strong>
              </p>
              <p class="chart-hover-tooltip__line chart-hover-tooltip__line--muted">
                <span>${comparisonPointLabel}</span>
                <strong>${formatValue(previousValue)}</strong>
              </p>
            `;

            const { offsetLeft, offsetTop } = chart.canvas;
            const x = tooltip.caretX;
            const y = tooltip.caretY;

            const parentEl = chart.canvas.parentNode as HTMLElement;
            const parentWidth = parentEl.clientWidth;
            const chartMiddleX =
              (chart.chartArea.left + chart.chartArea.right) / 2;
            const shouldShowOnRight = x <= chartMiddleX;
            const horizontalGap = 14;

            // Base anchor by side: left-half => tooltip on the right, right-half => tooltip on the left.
            let left = shouldShowOnRight
              ? offsetLeft + x + horizontalGap
              : offsetLeft + x - horizontalGap - tooltipEl.offsetWidth;

            // Keep tooltip inside container bounds to avoid clipping on edges.
            const minLeft = 8;
            const maxLeft = Math.max(
              parentWidth - tooltipEl.offsetWidth - 8,
              8,
            );
            left = Math.max(minLeft, Math.min(left, maxLeft));

            tooltipEl.style.transform = "translate(0, calc(-100% - 12px))";

            tooltipEl.style.opacity = "1";
            tooltipEl.style.left = `${left}px`;
            tooltipEl.style.top = `${offsetTop + y}px`;
          },
        },
      },
      scales: {
        x: {
          display: showXAxis,
          grid: {
            display: false,
          },
          ticks: {
            color: "#7b7b7b",
            maxRotation: 0,
            autoSkip: true,
          },
          border: {
            display: false,
          },
        },
        y: {
          display: showYAxis,
          min: 0,
          max,
          ticks: {
            color: "#7b7b7b",
            maxTicksLimit: 3,
          },
          grid: {
            color: "#f0dfb2",
          },
          border: {
            display: false,
          },
        },
      },
    },
    plugins: [verticalLinePlugin],
  });
}
