export default (req, res, next) => {
  const origin = req.headers.origin || '';

  // Если во входящем запросе есть указание Origin
  if (origin.trim() !== '') {
    // Устанавливаем исходящий CORS Origin на тот, что был указан в запросе
    // и отсылаем прочие необходимые заголовки.
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH'].join(', '),
    );
    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'origin, x-requested-with, content-type, accept',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', 3600);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Content-Length': '0' });
      res.end();

      return;
    }
  }
  next();
};
