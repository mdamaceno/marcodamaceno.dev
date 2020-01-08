function template(metadata) {
  const config = {
    title:
      metadata && metadata.title
        ? `${metadata.title} - Marco Damaceno`
        : 'Marco Damaceno',
    description: metadata && metadata.description ? metadata.description : '',
    lang: metadata && metadata.lang ? metadata.lang : 'pt-br',
  };

  return `<!DOCTYPE html>
<html lang="${config.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css" integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47" crossorigin="anonymous">
  <link rel="stylesheet" href="/styles/main.css">
  <title>${config.title}</title>
</head>
<body>
`;
}

module.exports = template;
