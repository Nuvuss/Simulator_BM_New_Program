import { google } from 'googleapis';
import { ChatMessage } from '@/types';
import { leads } from '@/data/leads';

export interface SubmitPayload {
  messages: ChatMessage[];
  candidateName: string;
  candidateEmail: string;
}

export const SHEET_HEADERS = [
  'Nama Kandidat',
  'Email Kandidat',
  'Transkrip Sesi 1 (Aliya)',
  'Transkrip Sesi 2 (Tomo)',
  'Transkrip Sesi 3 (Burhan)',
  'Transkrip Sesi 4 (Ika)',
];

function formatSessionTranscript(sessionMessages: ChatMessage[]): string {
  if (!sessionMessages || sessionMessages.length === 0) return '-';

  return sessionMessages
    .map((msg) => {
      const timeStr = new Date(msg.timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta',
      });

      const senderLabel =
        msg.sender === 'bm' ? 'Kandidat (BM)' : `Lead (${msg.leadName})`;

      const rtLabel =
        msg.sender === 'bm' && msg.responseTimeSec !== undefined
          ? ` [Respon: ${msg.responseTimeSec}s]`
          : '';

      return `[${timeStr}] ${senderLabel}${rtLabel}:\n${msg.text}`;
    })
    .join('\n\n');
}

export function formatCandidateRow(
  messages: ChatMessage[],
  candidateName: string,
  candidateEmail: string
): string[] {
  const sessionRows = leads.map((lead, index) => {
    const sessionMessages = messages.filter(
      (m) =>
        m.sectionIndex === index ||
        m.leadName?.toLowerCase() === lead.name.toLowerCase()
    );
    return formatSessionTranscript(sessionMessages);
  });

  return [candidateName, candidateEmail, ...sessionRows];
}

export function sanitizePrivateKey(rawKey: string | undefined): string {
  if (!rawKey) return '';
  let key = rawKey.trim();

  // 1. Bersihkan tanda kutip pembungkus ("..." atau '...') jika ada
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // 2. Ganti literal \n dan \r jika ada
  key = key.replace(/\\r/g, '').replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

  // 3. Jika karakter newline hilang (misal saat copy-paste ke input Vercel menjadi 1 baris rata),
  // rekonstruksi format PEM standar (pecah Base64 per 64 karakter)
  const beginHeader = '-----BEGIN PRIVATE KEY-----';
  const endFooter = '-----END PRIVATE KEY-----';

  if (key.includes(beginHeader) && key.includes(endFooter)) {
    const startIdx = key.indexOf(beginHeader) + beginHeader.length;
    const endIdx = key.indexOf(endFooter);
    const base64Body = key.slice(startIdx, endIdx).replace(/\s+/g, '');

    const chunks = [];
    for (let i = 0; i < base64Body.length; i += 64) {
      chunks.push(base64Body.slice(i, i + 64));
    }

    key = `${beginHeader}\n${chunks.join('\n')}\n${endFooter}\n`;
  }

  return key;
}

export async function ensureSheetExists(
  sheets: any,
  spreadsheetId: string,
  sheetName: string
): Promise<void> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = meta.data.sheets?.some(
    (s: any) => s.properties?.title === sheetName
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });
  }
}

export async function appendToGoogleSheet(
  messages: ChatMessage[],
  candidateName: string,
  candidateEmail: string
): Promise<void> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const privateKey = sanitizePrivateKey(rawKey);
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const sheetName = process.env.GOOGLE_SHEET_NAME?.trim() || 'Result New Program';

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      `Missing Google Sheets credentials. Email: ${!!serviceAccountEmail}, Key: ${!!privateKey}, SheetId: ${!!spreadsheetId}`
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // 1. Pastikan tab sheetName ada (auto-create jika belum ada)
  await ensureSheetExists(sheets, spreadsheetId, sheetName);

  // 2. Cek apakah baris 1 (Header) sudah ada
  const existingData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:F1`,
  });

  const firstRow = existingData.data.values?.[0];
  const needsHeader =
    !firstRow || firstRow.length === 0 || firstRow[0] !== 'Nama Kandidat';

  if (needsHeader) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:F1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [SHEET_HEADERS] },
    });
  }

  // 2. Format 1 baris per kandidat
  const candidateRow = formatCandidateRow(messages, candidateName, candidateEmail);

  // 3. Append baris kandidat ke sheet
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [candidateRow] },
  });
}
