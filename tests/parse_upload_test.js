const fs = require('fs');
const path = process.argv[2] || 'tests/sample_upload.txt';

function detectFields(text) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  let detectedName = null;
  let detectedBirth = null;
  let detectedDoc = null;
  let detectedPhone = null;
  let detectedCep = null;
  let detectedEmail = null;
  const remaining = [];

  for (const line of lines) {
    const l = line;
    if (!detectedEmail && /@/.test(l)) {
      detectedEmail = l;
      continue;
    }
    if (!detectedBirth && (/^\d{2}\/\d{2}\/\d{4}$/.test(l) || /^\d{4}-\d{2}-\d{2}$/.test(l))) {
      detectedBirth = l;
      continue;
    }
    const digitsOnly = l.replace(/\D/g, '');
    if (!detectedCep && digitsOnly.length === 8) {
      detectedCep = l;
      continue;
    }
    if (!detectedDoc && (digitsOnly.length === 11 || digitsOnly.length === 14)) {
      detectedDoc = l;
      continue;
    }
    if (!detectedPhone && (digitsOnly.length === 10 || digitsOnly.length === 11)) {
      detectedPhone = l;
      continue;
    }
    remaining.push(l);
  }

  if (!detectedName) {
    if (remaining.length > 0) detectedName = remaining.join(' ');
  }

  return {
    fullName: detectedName || null,
    birthRaw: detectedBirth || null,
    docRaw: detectedDoc || null,
    phoneRaw: detectedPhone || null,
    cepRaw: detectedCep || null,
    emailRaw: detectedEmail || null,
  };
}

try {
  const text = fs.readFileSync(path, 'utf8');
  const parsed = detectFields(text);
  console.log('Parsed result:');
  console.log(JSON.stringify(parsed, null, 2));
} catch (err) {
  console.error('Erro ao ler/parsear o arquivo:', err.message);
  process.exit(1);
}
