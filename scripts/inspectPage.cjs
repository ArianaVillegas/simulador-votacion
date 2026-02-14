const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // First visit the site to get cookies/session
  await page.goto('https://votoinformado.jne.gob.pe/', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('Loaded homepage');

  // Try the candidato search API from within the browser context (with cookies)
  const result = await page.evaluate(async () => {
    const res = await fetch('https://apiplataformaelectoral2.jne.gob.pe/api/v1/candidato', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ pageSize: 10, skip: 1, filter: { idProcesoElectoral: 124, numeroDocumento: '40044212' } })
    });
    const text = await res.text();
    return { status: res.status, body: text.substring(0, 500) };
  });
  console.log('API result:', result.status, result.body);

  // Also try the hoja-vida endpoint directly
  const result2 = await page.evaluate(async () => {
    const res = await fetch('https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?IdHojaVida=246513');
    const text = await res.text();
    return { status: res.status, body: text.substring(0, 500) };
  });
  console.log('Hoja vida result:', result2.status, result2.body);

  await browser.close();
})();
