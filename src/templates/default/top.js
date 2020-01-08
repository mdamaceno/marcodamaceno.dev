function template(metadata) {
  const config = {
    title: metadata.title
      ? `${metadata.title} - Marco Damaceno`
      : 'Marco Damaceno',
    description: metadata.description || '',
    lang: metadata.lang || 'pt-br',
  };

  return `<!DOCTYPE html>
<html lang="${config.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${config.title}</title>
</head>
<body>
`;
}

module.exports = template;
