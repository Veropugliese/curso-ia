// Busca la cotización y el historial de cada activo (activos.json) y regenera index.html.
// Se corre con Node.js: node scripts/actualizar.js

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const raiz = path.join(__dirname, '..');
const activos = JSON.parse(fs.readFileSync(path.join(raiz, 'activos.json'), 'utf8'));

const RUEDAS_TENDENCIA = 200;

async function consultarYahoo(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`;
  const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json();
  const result = json.chart && json.chart.result && json.chart.result[0];
  if (!result) throw new Error('sin datos');

  const meta = result.meta;
  const timestamps = result.timestamp || [];
  const closes = (result.indicators.quote[0] || {}).close || [];

  const serieCompleta = timestamps
    .map((t, i) => ({ fecha: t, cierre: closes[i] }))
    .filter((p) => typeof p.cierre === 'number');

  const serie = serieCompleta.slice(-RUEDAS_TENDENCIA);
  const ruedas = serie.length;
  const sma = ruedas ? serie.reduce((s, p) => s + p.cierre, 0) / ruedas : null;

  const precio = meta.regularMarketPrice;
  const previo = meta.chartPreviousClose;

  return {
    precio: Math.round(precio * 100) / 100,
    variacion: Math.round(((precio - previo) / previo) * 10000) / 100,
    moneda: meta.currency,
    sma: sma !== null ? Math.round(sma * 100) / 100 : null,
    ruedas,
    distanciaSma: sma !== null ? Math.round(((precio - sma) / sma) * 10000) / 100 : null,
    serie: serie.map((p) => Math.round(p.cierre * 100) / 100)
  };
}

function tendenciaDe(distanciaSma) {
  if (distanciaSma === null) return null;
  if (distanciaSma > 3) return 'alcista';
  if (distanciaSma < -3) return 'bajista';
  return 'lateral';
}

async function main() {
  const cotizaciones = [];
  for (const a of activos) {
    if (a.ticker) {
      try {
        const r = await consultarYahoo(a.ticker);
        cotizaciones.push({
          id: a.id, nombre: a.nombre, tipo: a.tipo, ticker: a.ticker,
          precio: r.precio, variacion: r.variacion, moneda: r.moneda, nota: null,
          sma: r.sma, ruedas: r.ruedas, distanciaSma: r.distanciaSma,
          tendencia: tendenciaDe(r.distanciaSma), serie: r.serie
        });
      } catch (err) {
        cotizaciones.push({
          id: a.id, nombre: a.nombre, tipo: a.tipo, ticker: a.ticker,
          precio: null, variacion: null, moneda: null, nota: `no se pudo consultar: ${err.message}`,
          sma: null, ruedas: 0, distanciaSma: null, tendencia: null, serie: []
        });
      }
    } else {
      cotizaciones.push({
        id: a.id, nombre: a.nombre, tipo: a.tipo, ticker: null,
        precio: null, variacion: null, moneda: null, nota: a.nota,
        sma: null, ruedas: 0, distanciaSma: null, tendencia: null, serie: []
      });
    }
  }

  const actualizado = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const datos = { actualizado, ruedasTendencia: RUEDAS_TENDENCIA, cotizaciones };

  const plantilla = fs.readFileSync(path.join(raiz, 'plantilla.html'), 'utf8');
  const pagina = plantilla.replace('__DATOS_JSON__', JSON.stringify(datos));
  const indexPath = path.join(raiz, 'index.html');
  fs.writeFileSync(indexPath, pagina, 'utf8');

  console.log(`Actualizado: ${actualizado}`);

  // Abre la pagina en el navegador que ya tengas abierto (agrega una pestana nueva)
  exec(`start "" "${indexPath}"`, (err) => {
    if (err) console.error('No se pudo abrir el navegador automaticamente:', err.message);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
