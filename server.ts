/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { db } from './src/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const app = express();
const PORT = 3000;

// Enable JSON middleware for POST payloads
app.use(express.json());

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: any, operationType: OperationType, pathStr: string) {
  const errInfo = {
    error: error?.message || String(error),
    operationType,
    path: pathStr,
    timestamp: new Date().toISOString()
  };
  console.error('Server-side Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// ----------------------------------------------------
// EMAIL NOTIFICATION HANDLING (aslam.shah.work@gmail.com)
// ----------------------------------------------------

const NOTIFICATION_RECIPIENT = 'aslam.shah.work@gmail.com';

// Lazily initialize SMTP transporter to prevent crash on startup if credentials not ready
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

// Sanitizes phone string to generate clickable WhatsApp Chat links
const getWhatsAppLink = (rawPhone: string) => {
  const digits = rawPhone.replace(/\D/g, '');
  const cleanDigits = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${cleanDigits}`;
};

// Renders consistent, high-end branded HTML layouts for dispatch emails
function buildEmailTemplate(title: string, subtitle: string, fields: { label: string; value: string; isCode?: boolean; isLink?: boolean }[]) {
  const rows = fields
    .map(
      (f) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e7e5e4; font-size: 13px; font-weight: bold; color: #44403c; width: 35%; text-align: left; vertical-align: top;">${f.label}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e7e5e4; font-size: 13px; color: #1c1917; text-align: left; vertical-align: top; ${f.isCode ? 'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 500;' : ''}">
          ${f.isLink ? `<a href="${f.value}" target="_blank" style="color: #047857; font-weight: bold; text-decoration: underline;">Open WhatsApp Chat</a>` : f.value || 'N/A'}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f4; padding: 40px 20px; min-height: 100%;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #e7e5e4;">
        <!-- Header banner matching Infantree elite emerald visual layout -->
        <tr>
          <td style="background-color: #022c22; padding: 28px 24px; text-align: center;">
            <p style="margin: 0; font-size: 10px; font-weight: bold; color: #5eead4; text-transform: uppercase; letter-spacing: 0.15em;">Infantree Care Real-time Notification Desk</p>
            <h1 style="margin: 8px 0 0 0; font-family: Georgia, serif; font-size: 24px; color: #ffffff; font-weight: normal; letter-spacing: 0.05em;">${title}</h1>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #ccfbf1;">${subtitle}</p>
          </td>
        </tr>
        <!-- Content Body details -->
        <tr>
          <td style="padding: 30px 24px;">
            <p style="font-size: 14px; color: #57534e; margin-bottom: 24px; line-height: 1.5; text-align: left;">
              Hello Administrator,<br/><br/>
              A new customer milestone has been registered. The subscriber's customized calendar details are attached below:
            </p>
            <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              ${rows}
            </table>
          </td>
        </tr>
        <!-- Footer details -->
        <tr>
          <td style="padding: 16px 24px; background-color: #fafaf9; border-top: 1px solid #e7e5e4; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #78716c; font-family: ui-monospace, monospace;">Sent via Cloud Run secure node at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            <p style="margin: 4px 0 0 0; font-size: 10px; color: #a8a29e;">© 2026 Infantree Postpartum Care Services Private Limited. Vashi, Navi Mumbai.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// Low-blocking background sender
async function sendNotificationEmail(subject: string, htmlContent: string) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log('\n--- EMAIL LOG SIMULATION (No SMTP credentials in .env yet) ---');
    console.log(`To: ${NOTIFICATION_RECIPIENT}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body Snippet:\n[HTML Content Generated Successfully]`);
    console.log('-------------------------------------------------------------\n');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Infantree Core AI" <${process.env.SMTP_USER}>`,
      to: NOTIFICATION_RECIPIENT,
      subject,
      html: htmlContent,
    });
    console.log(`✅ Real-time email alert successfully delivered to ${NOTIFICATION_RECIPIENT}`);
  } catch (error) {
    console.error('❌ Failed to dispatch SMTP email notification:', error);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Capture Leads
app.post('/api/leads', async (req, res) => {
  const { name, phone, email, location, serviceInterest, message, source } = req.body;
  
  if (!name || !phone || !location) {
    return res.status(400).json({ error: 'Name, phone number, and location are required.' });
  }

  const payload = {
    name: name.substring(0, 200),
    phone: phone.substring(0, 30),
    email: email ? email.substring(0, 254) : '',
    location: location.substring(0, 500),
    serviceInterest: serviceInterest ? serviceInterest.substring(0, 200) : 'General Inquiry',
    message: message ? message.substring(0, 2000) : '',
    timestamp: new Date().toISOString(),
    source: source ? source.substring(0, 100) : 'Website Form'
  };

  try {
    const docRef = await addDoc(collection(db, 'leads'), payload);

    // Build notifications without awaiting them so API response returns instantly
    const emailSubject = `✨ [Infantree Lead] New Inquiry from ${payload.name} (${payload.location})`;
    const emailHtml = buildEmailTemplate(
      'New Lead Inquiry Captured',
      'Contact Form & Custom Care Calendar Request',
      [
        { label: 'Parent Name', value: payload.name },
        { label: 'WhatsApp Mobile', value: payload.phone, isCode: true },
        { label: 'WhatsApp Link', value: getWhatsAppLink(payload.phone), isLink: true },
        { label: 'Email Address', value: payload.email || 'Not Provided' },
        { label: 'Navi Mumbai Sector', value: payload.location },
        { label: 'Requested Service', value: payload.serviceInterest },
        { label: 'Specific Baby Notes', value: payload.message || 'None provided' },
        { label: 'Form Source Location', value: payload.source }
      ]
    );
    sendNotificationEmail(emailSubject, emailHtml).catch(err => {
      console.error('Asynchronous Lead Email failed:', err);
    });

    return res.status(201).json({ success: true, id: docRef.id, message: 'Lead captured successfully.' });
  } catch (error) {
    const details = handleFirestoreError(error, OperationType.CREATE, 'leads');
    return res.status(500).json({ error: 'Database write failed', details });
  }
});

// 2. Capture Bookings
app.post('/api/bookings', async (req, res) => {
  const { name, phone, email, location, selectedPlan, notes, source } = req.body;

  if (!name || !phone || !location || !selectedPlan) {
    return res.status(400).json({ error: 'Name, phone number, location, and plan are required.' });
  }

  const payload = {
    name: name.substring(0, 200),
    phone: phone.substring(0, 30),
    email: email ? email.substring(0, 254) : '',
    location: location.substring(0, 500),
    selectedPlan: selectedPlan.substring(0, 200),
    notes: notes ? notes.substring(0, 2000) : '',
    timestamp: new Date().toISOString(),
    source: source ? source.substring(0, 100) : 'Website Booking'
  };

  try {
    const docRef = await addDoc(collection(db, 'bookings'), payload);

    // Dispatch background email alert to target mailbox
    const emailSubject = `🔥 [Infantree Subscription] New Program Booking: ${payload.selectedPlan} by ${payload.name}`;
    const emailHtml = buildEmailTemplate(
      'New Program Subscription',
      'Daily Structured Monthly/Long-term Program Booking',
      [
        { label: 'Parent Name', value: payload.name },
        { label: 'Selected Plan', value: payload.selectedPlan },
        { label: 'WhatsApp Mobile', value: payload.phone, isCode: true },
        { label: 'WhatsApp Link', value: getWhatsAppLink(payload.phone), isLink: true },
        { label: 'Email Address', value: payload.email || 'Not Provided' },
        { label: 'Navi Mumbai Sector', value: payload.location },
        { label: 'Scheduling / Due Notes', value: payload.notes || 'None provided' },
        { label: 'Booking Source Type', value: payload.source }
      ]
    );
    sendNotificationEmail(emailSubject, emailHtml).catch(err => {
      console.error('Asynchronous Booking Email failed:', err);
    });

    return res.status(201).json({ success: true, id: docRef.id, message: 'Booking completed successfully.' });
  } catch (error) {
    const details = handleFirestoreError(error, OperationType.CREATE, 'bookings');
    return res.status(500).json({ error: 'Database write failed', details });
  }
});

// 3. Capture Trial Requests
app.post('/api/trials', async (req, res) => {
  const { name, phone, email, location, notes, source } = req.body;

  if (!name || !phone || !location) {
    return res.status(400).json({ error: 'Name, phone number, and location are required.' });
  }

  const payload = {
    name: name.substring(0, 200),
    phone: phone.substring(0, 30),
    email: email ? email.substring(0, 254) : '',
    location: location.substring(0, 500),
    notes: notes ? notes.substring(0, 2000) : '',
    timestamp: new Date().toISOString(),
    source: source ? source.substring(0, 100) : 'Trial Booking Form'
  };

  try {
    const docRef = await addDoc(collection(db, 'trial_requests'), payload);

    // Dispatch background email alert
    const emailSubject = `📅 [Infantree Trial] New Trial Session Scheduled by ${payload.name} (${payload.location})`;
    const emailHtml = buildEmailTemplate(
      'New At-Home Trial Requested',
      'Single Session Commitment-Free Touch Trial',
      [
        { label: 'Parent Name', value: payload.name },
        { label: 'WhatsApp Mobile', value: payload.phone, isCode: true },
        { label: 'WhatsApp Link', value: getWhatsAppLink(payload.phone), isLink: true },
        { label: 'Email Address', value: payload.email || 'Not Provided' },
        { label: 'Navi Mumbai Sector', value: payload.location },
        { label: 'Specific Care Notes', value: payload.notes || 'None provided' },
        { label: 'Form Source Location', value: payload.source }
      ]
    );
    sendNotificationEmail(emailSubject, emailHtml).catch(err => {
      console.error('Asynchronous Trial Email failed:', err);
    });

    return res.status(201).json({ success: true, id: docRef.id, message: 'Trial session booked successfully.' });
  } catch (error) {
    const details = handleFirestoreError(error, OperationType.CREATE, 'trial_requests');
    return res.status(500).json({ error: 'Database write failed', details });
  }
});

// Admin Passcode Check Helper
const getAdminPasscode = () => {
  return process.env.ADMIN_PASSCODE || 'infantree-luxury-admin-2026';
};

// 4. Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ success: false, error: 'Passcode is required.' });
  }
  
  if (passcode === getAdminPasscode()) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: 'Invalid passcode.' });
  }
});

// 5. Query leads, bookings, trial requests securely
app.post('/api/admin/records', async (req, res) => {
  const { passcode } = req.body;
  if (!passcode || passcode !== getAdminPasscode()) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    // Read collections (bypassing security rules internally as server, but securely locked behind passcode)
    const leadsSnap = await getDocs(query(collection(db, 'leads'), orderBy('timestamp', 'desc')));
    const bookingsSnap = await getDocs(query(collection(db, 'bookings'), orderBy('timestamp', 'desc')));
    const trialsSnap = await getDocs(query(collection(db, 'trial_requests'), orderBy('timestamp', 'desc')));

    const leads = leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const bookings = bookingsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const trials = trialsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return res.json({
      success: true,
      leads,
      bookings,
      trials,
    });
  } catch (error) {
    const details = handleFirestoreError(error, OperationType.LIST, 'admin_records');
    return res.status(500).json({ error: 'Failed to retrieve database entries.', details });
  }
});

// ----------------------------------------------------
// VITE OR STATIC MIDDLEWARE CONFIGURATION
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Initiated development mode with Vite live gateway.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Initiated production static distribution server.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully listening on port ${PORT}`);
  });
}

start();
