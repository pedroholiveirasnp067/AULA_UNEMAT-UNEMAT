const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, Header, AlignmentType,
  HeadingLevel, WidthType, BorderStyle, PageNumber, LevelFormat, VerticalAlign, HeightRule,
} = require('docx');

const C = JSON.parse(fs.readFileSync(__dirname + '/content.json', 'utf8'));
const FONT = 'Times New Roman';
const W = 9071; // largura útil (A4, margens 3 cm esq. e 2 cm dir.)

// ---------- utilidades ----------
function runs(text, opts = {}) {
  const out = [];
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).filter((s) => s !== '');
  parts.forEach((tok) => {
    if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) out.push(new TextRun({ text: tok.slice(2, -2), bold: true, ...opts }));
    else if (tok.startsWith('*') && tok.endsWith('*') && tok.length > 2) out.push(new TextRun({ text: tok.slice(1, -1), italics: true, ...opts }));
    else out.push(new TextRun({ text: tok, ...opts }));
  });
  return out;
}
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const LINE = (sz) => ({ style: BorderStyle.SINGLE, size: sz, color: '000000' });

// ---------- numeração das alíneas ----------
let nAlin = 0;
C.blocks.forEach((b) => { if (b.t === 'alineas') { nAlin += 1; b.ref = 'alineas' + nAlin; } });
const numberingConfig = [];
for (let i = 1; i <= nAlin; i++) {
  numberingConfig.push({
    reference: 'alineas' + i,
    levels: [{ level: 0, format: LevelFormat.LOWER_LETTER, text: '%1)', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 1134, hanging: 425 } } } }],
  });
}

// ---------- tabelas / quadros ----------
function cellParas(text, align, opts) {
  const lines = String(text).split('\n');
  return lines.map((ln) => new Paragraph({
    alignment: align, keepNext: !!opts.keepNext,
    spacing: { before: 20, after: 20, line: 240 },
    children: runs(ln, { size: 20, font: FONT, bold: !!opts.bold }),
  }));
}
function mkTable(b, keep = true) {
  const quadro = b.kind === 'Quadro';
  const cols = b.cols;
  const total = cols.reduce((a, x) => a + x, 0);
  const nC = cols.length;
  const aligns = b.aligns.map((a) => (a === 'right' ? AlignmentType.RIGHT : AlignmentType.LEFT));
  const margins = { top: 50, bottom: 50, left: 90, right: 90 };
  const rows = [];
  const bd = (top, bottom) => quadro
    ? { top: LINE(4), bottom: LINE(4), left: LINE(4), right: LINE(4) }
    : { top, bottom, left: NONE, right: NONE };
  // cabeçalho
  rows.push(new TableRow({
    tableHeader: true, cantSplit: true,
    children: b.header.map((h, i) => new TableCell({
      width: { size: cols[i], type: WidthType.DXA }, margins, verticalAlign: VerticalAlign.CENTER,
      borders: bd(LINE(12), LINE(6)),
      shading: quadro ? { type: 'clear', fill: 'EDEDED', color: 'auto' } : undefined,
      children: cellParas(h, i === 0 ? AlignmentType.LEFT : (quadro ? AlignmentType.LEFT : AlignmentType.CENTER), { bold: true, keepNext: true }),
    })),
  }));
  const nR = b.rows.length;
  b.rows.forEach((r, ri) => {
    const last = ri === nR - 1;
    const isGroup = b.groups.includes(ri);
    const isBold = b.bold_rows.includes(ri);
    const keepNext = keep && !last;
    if (isGroup) {
      rows.push(new TableRow({
        cantSplit: true,
        children: [new TableCell({
          width: { size: total, type: WidthType.DXA }, columnSpan: nC, margins,
          borders: bd(NONE, last ? LINE(12) : NONE),
          children: cellParas(r[0], AlignmentType.LEFT, { bold: true, keepNext: true }),
        })],
      }));
    } else {
      rows.push(new TableRow({
        cantSplit: true,
        children: r.map((txt, i) => new TableCell({
          width: { size: cols[i], type: WidthType.DXA }, margins, verticalAlign: quadro ? VerticalAlign.TOP : VerticalAlign.CENTER,
          borders: bd(isBold ? LINE(4) : NONE, last ? LINE(12) : NONE),
          children: cellParas(txt, aligns[i], { bold: isBold || (quadro && i === 1), keepNext }),
        })),
      }));
    }
  });
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: cols, alignment: AlignmentType.CENTER, rows,
    borders: quadro
      ? { top: LINE(4), bottom: LINE(4), left: LINE(4), right: LINE(4), insideHorizontal: LINE(4), insideVertical: LINE(4) }
      : { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
  });
}
function caption(kind, num, title) {
  return new Paragraph({
    style: 'Caption10',
    children: [new TextRun({ text: `${kind} ${num} – `, bold: true, size: 20, font: FONT }), new TextRun({ text: title, size: 20, font: FONT })],
  });
}
function fonteNota(source, note) {
  const out = [new Paragraph({ style: 'Fonte10', keepNext: false, children: [new TextRun({ text: 'Fonte: ', bold: true, size: 20, font: FONT }), new TextRun({ text: source, size: 20, font: FONT })] })];
  if (note) {
    out.push(new Paragraph({ style: 'Fonte10', spacing: { before: 0, after: 240, line: 240 }, children: [new TextRun({ text: 'Nota: ', bold: true, size: 20, font: FONT }), new TextRun({ text: note, size: 20, font: FONT })] }));
    out[0] = new Paragraph({ style: 'Fonte10', spacing: { before: 60, after: 60, line: 240 }, children: [new TextRun({ text: 'Fonte: ', bold: true, size: 20, font: FONT }), new TextRun({ text: source, size: 20, font: FONT })] });
  }
  return out;
}

// ---------- blocos do texto ----------
const main = [];
const heads = []; // para o sumário
let firstH1 = true;
C.blocks.forEach((b) => {
  if (b.t === 'h1') {
    main.push(new Paragraph({
      heading: HeadingLevel.HEADING_1, pageBreakBefore: !firstH1,
      alignment: b.numbered ? AlignmentType.LEFT : AlignmentType.CENTER, children: [new TextRun({ text: b.text, font: FONT })],
    }));
    heads.push({ text: b.text, level: 1 });
    firstH1 = false;
  } else if (b.t === 'h2') {
    main.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: b.text, font: FONT })] }));
    heads.push({ text: b.text, level: 2 });
  } else if (b.t === 'p') {
    main.push(new Paragraph({ style: 'Body', children: runs(b.text) }));
  } else if (b.t === 'alineas') {
    b.items.forEach((it) => main.push(new Paragraph({ style: 'Alinea', numbering: { reference: b.ref, level: 0 }, children: runs(it) })));
    main.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
  } else if (b.t === 'table') {
    main.push(caption(b.kind, b.num, b.title));
    main.push(mkTable(b, b.rows.length <= 16));
    fonteNota(b.source, b.note).forEach((x) => main.push(x));
  } else if (b.t === 'chart') {
    main.push(caption('Gráfico', b.num, b.title));
    main.push(new Paragraph({
      alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 0, after: 0, line: 240 },
      children: [new ImageRun({ type: 'png', data: fs.readFileSync(b.img), transformation: { width: b.w, height: b.h },
        altText: { title: `Gráfico ${b.num}`, description: b.title, name: `grafico_${b.num}` } })],
    }));
    fonteNota(b.source, b.note).forEach((x) => main.push(x));
  }
});

// ---------- REFERÊNCIAS ----------
main.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'REFERÊNCIAS', font: FONT })] }));
heads.push({ text: 'REFERÊNCIAS', level: 1 });
C.refs.forEach((r) => main.push(new Paragraph({ style: 'Ref', children: runs(r) })));

// ---------- ANEXO A ----------
main.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ANEXO A – ESTRUTURA DO QUESTIONÁRIO APLICADO', font: FONT })] }));
heads.push({ text: 'ANEXO A – ESTRUTURA DO QUESTIONÁRIO APLICADO', level: 1 });
main.push(new Paragraph({ style: 'Body', children: runs('O quadro a seguir apresenta as perguntas e as opções de resposta do formulário aplicado, reconstruídas a partir das respostas registradas na planilha de coleta. As perguntas P1 a P6 caracterizam o perfil; as perguntas Q1 a Q12 tratam de conhecimento e percepção em cultura fiscal.') }));
main.push(new Paragraph({ style: 'Caption10', children: [new TextRun({ text: 'Quadro A1 – ', bold: true, size: 20, font: FONT }), new TextRun({ text: 'Perguntas e opções de resposta do questionário', size: 20, font: FONT })] }));
main.push(mkTable({ kind: 'Quadro', cols: [700, 4000, 4371], header: ['Nº', 'Pergunta', 'Opções de resposta'], aligns: ['left', 'left', 'left'], rows: C.anexoA, groups: [], bold_rows: [] }, false));
fonteNota('Formulário de coleta do projeto Cidadania Fiscal – Sinop/MT 2026 (planilha de respostas).', 'A pergunta Q6 admitia mais de uma opção de resposta. Opções reconstruídas a partir das respostas registradas; consultar o formulário original para eventuais opções não selecionadas por nenhum participante.').forEach((x) => main.push(x));

// ---------- ANEXO B ----------
main.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'ANEXO B – REGISTROS FOTOGRÁFICOS DAS ATIVIDADES', font: FONT })] }));
heads.push({ text: 'ANEXO B – REGISTROS FOTOGRÁFICOS DAS ATIVIDADES', level: 1 });
main.push(new Paragraph({ style: 'Body', children: [new TextRun({ text: '[Substituir os quadros pontilhados abaixo pelas fotografias da atividade no MultiAção 2026 e ajustar as legendas. Apagar esta orientação.]', highlight: 'yellow' })] }));
const DASH = { style: BorderStyle.DASHED, size: 6, color: '808080' };
for (let i = 1; i <= 4; i++) {
  main.push(new Paragraph({ style: 'Caption10', children: [new TextRun({ text: `Fotografia ${i} – `, bold: true, size: 20, font: FONT }), new TextRun({ text: '[legenda da fotografia]', size: 20, font: FONT, highlight: 'yellow' })] }));
  main.push(new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [new TableRow({ height: { value: 3000, rule: HeightRule.EXACT }, cantSplit: true, children: [new TableCell({
      width: { size: W, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
      borders: { top: DASH, bottom: DASH, left: DASH, right: DASH },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `[Inserir fotografia ${i}]`, size: 22, font: FONT, color: '595959', highlight: 'yellow' })] })],
    })] })],
  }));
  main.push(new Paragraph({ style: 'Fonte10', children: [new TextRun({ text: 'Fonte: ', bold: true, size: 20, font: FONT }), new TextRun({ text: 'Acervo do projeto Cidadania Fiscal – Sinop/MT (2026).', size: 20, font: FONT })] }));
}

// ---------- CAPA ----------
const logoSefaz = fs.readFileSync(__dirname + '/_sefaz_marca_horizontal_png.png');
const logoUnemat = fs.readFileSync(__dirname + '/Logotipo_Unemat.png');
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const cover = [
  new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [4535, 4536],
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new TableRow({ children: [
      new TableCell({ width: { size: 4535, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new ImageRun({ type: 'png', data: logoSefaz, transformation: { width: 252, height: 81 }, altText: { title: 'Logotipo SEFAZ-MT', description: 'Logotipo da Secretaria de Estado de Fazenda de Mato Grosso', name: 'logo_sefaz' } })] })] }),
      new TableCell({ width: { size: 4536, type: WidthType.DXA }, borders: noBorders, verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new ImageRun({ type: 'png', data: logoUnemat, transformation: { width: 210, height: 81 }, altText: { title: 'Logotipo UNEMAT', description: 'Logotipo da Universidade do Estado de Mato Grosso', name: 'logo_unemat' } })] })] }),
    ] })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 700, after: 0, line: 360 }, children: [new TextRun({ text: 'UNIVERSIDADE DO ESTADO DE MATO GROSSO – UNEMAT', bold: true, font: FONT, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 360 }, children: [new TextRun({ text: 'SECRETARIA DE ESTADO DE FAZENDA DE MATO GROSSO – SEFAZ-MT', bold: true, font: FONT, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1000, after: 0, line: 360 }, children: [new TextRun({ text: 'Pedro Henrique de Oliveira', font: FONT, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 360 }, children: [new TextRun({ text: 'Marisandra Geane Fungueto', font: FONT, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2300, after: 0, line: 360 }, children: [new TextRun({ text: 'CIDADANIA FISCAL NA PRÁTICA', bold: true, font: FONT, size: 32 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 0, line: 360 }, children: [new TextRun({ text: 'Pesquisa sobre consciência fiscal e divulgação do Programa Nota MT na 5ª edição do MultiAção 2026', font: FONT, size: 26 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 3300, after: 0, line: 360 }, children: [new TextRun({ text: 'Sinop – MT', font: FONT, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0, line: 360 }, children: [new TextRun({ text: '2026', font: FONT, size: 24 })] }),
];

// ---------- SUMÁRIO + RESUMO ----------
const pre = [
  new Paragraph({ style: 'SemNumero', children: [new TextRun({ text: 'SUMÁRIO', font: FONT })] }),
  new Paragraph({ style: 'TOC1', children: [new TextRun({ text: '@@TOC@@', font: FONT })] }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'RESUMO', font: FONT })] }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 240, after: 0 }, children: [new TextRun({ text: C.resumo, font: FONT, size: 24 })] }),
  new Paragraph({ alignment: AlignmentType.LEFT, spacing: { before: 360, line: 240 }, children: [new TextRun({ text: 'Palavras-chave: ', bold: true, font: FONT, size: 24 }), new TextRun({ text: C.palavras, font: FONT, size: 24 })] }),
];
// o RESUMO entra no sumário, antes das seções numeradas
heads.unshift({ text: 'RESUMO', level: 1 });
fs.writeFileSync(__dirname + '/heads.json', JSON.stringify(heads, null, 1));

// ---------- documento ----------
const pageProps = { page: { size: { width: 11906, height: 16838 }, margin: { top: 1701, left: 1701, right: 1134, bottom: 1134, header: 1134, footer: 567 } } };
const emptyHeader = () => new Header({ children: [new Paragraph({ children: [] })] });
const numHeader = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] })] });

const doc = new Document({
  creator: 'Pedro Henrique de Oliveira; Marisandra Geane Fungueto',
  title: 'Cidadania Fiscal na Prática – Sinop/MT 2026',
  description: 'Relatório da pesquisa sobre consciência fiscal e divulgação do Nota MT no MultiAção 2026',
  styles: {
    default: { document: { run: { font: FONT, size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Body', quickFormat: true,
        run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 0, after: 360, line: 360 }, keepNext: true, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Body', quickFormat: true,
        run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 360, after: 240, line: 360 }, keepNext: true, outlineLevel: 1 } },
      { id: 'Body', name: 'Corpo de texto ABNT', basedOn: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24 }, paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 0 }, indent: { firstLine: 709 } } },
      { id: 'Alinea', name: 'Alínea ABNT', basedOn: 'Normal', run: { font: FONT, size: 24 },
        paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 0 } } },
      { id: 'Caption10', name: 'Legenda ABNT', basedOn: 'Normal', run: { font: FONT, size: 20 },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 240, after: 100, line: 240 }, keepNext: true } },
      { id: 'Fonte10', name: 'Fonte ABNT', basedOn: 'Normal', run: { font: FONT, size: 20 },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 60, after: 240, line: 240 } } },
      { id: 'SemNumero', name: 'Título sem indicativo', basedOn: 'Normal', run: { font: FONT, size: 24, bold: true },
        paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 0, after: 360, line: 360 }, keepNext: true } },
      { id: 'Ref', name: 'Referência ABNT', basedOn: 'Normal', run: { font: FONT, size: 24 },
        paragraph: { alignment: AlignmentType.LEFT, spacing: { before: 0, after: 240, line: 240 } } },
      { id: 'TOC1', name: 'toc 1', basedOn: 'Normal', run: { font: FONT, size: 24, bold: true },
        paragraph: { spacing: { before: 0, after: 100, line: 240 } } },
      { id: 'TOC2', name: 'toc 2', basedOn: 'Normal', run: { font: FONT, size: 24 },
        paragraph: { spacing: { before: 0, after: 100, line: 240 }, indent: { left: 284 } } },
    ],
  },
  numbering: { config: numberingConfig },
  sections: [
    { properties: pageProps, headers: { default: emptyHeader() }, children: cover },
    { properties: pageProps, headers: { default: emptyHeader() }, children: pre },
    { properties: pageProps, headers: { default: numHeader }, children: main },
  ],
});
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(__dirname + '/pass1.docx', buf);
  console.log('pass1.docx escrito', buf.length, 'bytes; headings:', heads.length);
});