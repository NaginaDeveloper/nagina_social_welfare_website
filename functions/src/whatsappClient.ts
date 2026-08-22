import { logger } from 'firebase-functions';
import type { FaqLang } from './whatsappFaq';
import { menuBody } from './whatsappFaq';

const GRAPH_VERSION = 'v22.0';

export interface WhatsappSecrets {
  readonly accessToken: string;
  readonly phoneNumberId: string;
}

interface GraphMessageResponse {
  readonly messages?: readonly { readonly id?: string }[];
  readonly error?: { readonly message?: string };
}

function graphUrl(phoneNumberId: string): string {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`;
}

async function postMessage(
  secrets: WhatsappSecrets,
  payload: Record<string, unknown>,
): Promise<string | null> {
  const response = await fetch(graphUrl(secrets.phoneNumberId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secrets.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...payload }),
  });
  const data = (await response.json()) as GraphMessageResponse;
  if (!response.ok) {
    logger.error('WhatsApp send failed', { status: response.status, data });
    return null;
  }
  return data.messages?.[0]?.id ?? null;
}

export async function sendWhatsappText(
  secrets: WhatsappSecrets,
  to: string,
  body: string,
): Promise<string | null> {
  return postMessage(secrets, {
    to,
    type: 'text',
    text: { body, preview_url: true },
  });
}

export async function markWhatsappRead(
  secrets: WhatsappSecrets,
  messageId: string,
): Promise<void> {
  try {
    await postMessage(secrets, {
      status: 'read',
      message_id: messageId,
    });
  } catch (err) {
    logger.warn('Could not mark WhatsApp message read', err);
  }
}

export async function sendWhatsappMenu(
  secrets: WhatsappSecrets,
  to: string,
  lang: FaqLang,
): Promise<string | null> {
  const isUr = lang === 'ur';
  const id = await postMessage(secrets, {
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: menuBody(lang) },
      action: {
        button: isUr ? 'موضوع چنیں' : 'Choose a topic',
        sections: [
          {
            title: isUr ? 'مدد' : 'Help',
            rows: [
              {
                id: 'about',
                title: isUr ? 'تعارف اور رابطہ' : 'About & contact',
                description: isUr ? 'ادارہ اور رابطہ کی تفصیل' : 'Who we are and how to reach us',
              },
              {
                id: 'apply',
                title: isUr ? 'داخلہ فارم' : 'Application form',
                description: isUr ? 'آن لائن داخلہ کیسے کریں' : 'How to apply online for a place',
              },
              {
                id: 'donate',
                title: isUr ? 'عطیات' : 'Donations',
                description: isUr ? 'کارڈ، پے پال یا بینک' : 'Card, PayPal, PayIt or bank',
              },
              {
                id: 'ask',
                title: isUr ? 'کوئی اور سوال' : 'Ask a question',
                description: isUr ? 'انگریزی یا اردو میں لکھیں' : 'Type in English or Urdu',
              },
            ],
          },
        ],
      },
    },
  });
  return id;
}
