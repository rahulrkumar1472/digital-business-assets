import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type SimulatorPayload = {
  generatedAt?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  note?: string;
};

function wrapText(text: string, maxLength = 94) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current.length) {
      current = word;
      continue;
    }

    if (`${current} ${word}`.length > maxLength) {
      lines.push(current);
      current = word;
      continue;
    }

    current = `${current} ${word}`;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function buildSummary(payload: SimulatorPayload) {
  const generatedAt = payload.generatedAt || new Date().toISOString();
  const inputs = JSON.stringify(payload.inputs || {}, null, 2);
  const outputs = JSON.stringify(payload.outputs || {}, null, 2);

  return [
    "Digital Business Assets",
    "AI Growth Plan Summary",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "Inputs",
    inputs,
    "",
    "Outputs",
    outputs,
    "",
    payload.note || "Projection only. Not a guarantee of revenue outcomes.",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as SimulatorPayload;
    const summary = buildSummary(payload);

    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const page = pdf.addPage([595.28, 841.89]);

    page.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(0.02, 0.04, 0.09) });
    page.drawRectangle({ x: 36, y: 36, width: 523.28, height: 769.89, borderColor: rgb(0.2, 0.85, 0.95), borderWidth: 1 });

    page.drawText("Digital Business Assets", {
      x: 56,
      y: 780,
      size: 22,
      font: fontBold,
      color: rgb(0.88, 0.98, 1),
    });

    page.drawText("Growth Simulator PDF Export", {
      x: 56,
      y: 754,
      size: 11,
      font,
      color: rgb(0.55, 0.8, 0.95),
    });

    let y = 726;
    const lines = summary.split("\n").flatMap((line) => wrapText(line.length ? line : " "));

    for (const line of lines) {
      if (y < 64) {
        const next = pdf.addPage([595.28, 841.89]);
        next.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(0.02, 0.04, 0.09) });
        next.drawRectangle({ x: 36, y: 36, width: 523.28, height: 769.89, borderColor: rgb(0.2, 0.85, 0.95), borderWidth: 1 });
        next.drawText("Digital Business Assets", {
          x: 56,
          y: 780,
          size: 18,
          font: fontBold,
          color: rgb(0.88, 0.98, 1),
        });
        y = 744;
      }

      const activePage = pdf.getPages()[pdf.getPageCount() - 1];
      activePage.drawText(line, {
        x: 56,
        y,
        size: 9.5,
        font,
        color: rgb(0.85, 0.88, 0.93),
      });
      y -= 13;
    }

    const bytes = await pdf.save();
    const buffer = Buffer.from(bytes);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=growth-plan-summary.pdf",
      },
    });
  } catch (error) {
    console.error("[api/simulator/pdf] failed", error);
    return NextResponse.json({ error: "Could not generate plan PDF." }, { status: 400 });
  }
}
