// Small charts drawn as inline SVG, no library and no network.
// Both helpers take plain numbers and return a string of SVG markup.

export function trendChart(months) {
  const width = 640;
  const height = 260;
  const pad = 34;
  const top = Math.max(...months.map((m) => m.income)) * 1.08;
  const slot = (width - pad * 2) / months.length;
  const barW = 22;
  let bars = '';
  let labels = '';
  months.forEach((m, i) => {
    const x = pad + i * slot + slot / 2;
    const incomeH = (m.income / top) * (height - pad - 40);
    const spentH = (m.spent / top) * (height - pad - 40);
    const base = height - 40;
    bars += `<rect x="${(x - barW - 3).toFixed(1)}" y="${(base - incomeH).toFixed(1)}" width="${barW}" height="${incomeH.toFixed(1)}" rx="4" fill="#2f6f5e"><title>${m.month} income ¥${m.income.toLocaleString('en-US')}</title></rect>`;
    bars += `<rect x="${(x + 3).toFixed(1)}" y="${(base - spentH).toFixed(1)}" width="${barW}" height="${spentH.toFixed(1)}" rx="4" fill="#d98a2b"><title>${m.month} spent ¥${m.spent.toLocaleString('en-US')}</title></rect>`;
    labels += `<text x="${x.toFixed(1)}" y="${height - 16}" text-anchor="middle" font-size="13" fill="#5c6b66">${m.month}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Income and spending by month" style="width:100%;height:auto;display:block">
    <line x1="${pad}" y1="${height - 40}" x2="${width - pad}" y2="${height - 40}" stroke="#d8ddd9" stroke-width="1"/>
    ${bars}${labels}
    <text x="${pad}" y="20" font-size="13" fill="#2f6f5e">■ Income</text>
    <text x="${pad + 90}" y="20" font-size="13" fill="#d98a2b">■ Spent</text>
  </svg>`;
}

export function shareDonut(parts) {
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1;
  const size = 260;
  const radius = 96;
  const centre = size / 2;
  let angle = -Math.PI / 2;
  let slices = '';
  let legend = '';
  for (const part of parts) {
    const sweep = (part.value / total) * Math.PI * 2;
    const x1 = centre + radius * Math.cos(angle);
    const y1 = centre + radius * Math.sin(angle);
    const x2 = centre + radius * Math.cos(angle + sweep);
    const y2 = centre + radius * Math.sin(angle + sweep);
    const big = sweep > Math.PI ? 1 : 0;
    slices += `<path d="M ${centre} ${centre} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${big} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${part.color}"><title>${part.label}: ¥${part.value.toLocaleString('en-US')}</title></path>`;
    const pct = Math.round((part.value / total) * 100);
    legend += `<li><span class="dot" style="background:${part.color}"></span>${part.label} <b>${pct}%</b> · ¥${part.value.toLocaleString('en-US')}</li>`;
    angle += sweep;
  }
  const hole = `<circle cx="${centre}" cy="${centre}" r="58" fill="#fffdf8"/><text x="${centre}" y="${centre - 4}" text-anchor="middle" font-size="15" fill="#5c6b66">Spent in Nov</text><text x="${centre}" y="${centre + 20}" text-anchor="middle" font-size="19" font-weight="700" fill="#22302b">¥${total.toLocaleString('en-US')}</text>`;
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending share by category" style="width:240px;height:240px">${slices}${hole}</svg><ul class="legend">${legend}</ul></div>`;
}
