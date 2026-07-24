import nodemailer from "nodemailer";
import type { LeadRequest } from "@/src/types/chat";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendLeadEmail(data: LeadRequest) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser) {
    throw new Error("EMAIL_USER não está configurado.");
  }

  if (!emailPass) {
    throw new Error("EMAIL_PASS não está configurado.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const insuranceType = escapeHtml(data.insuranceType);
  const contact = escapeHtml(data.contact);
  const name = escapeHtml(data.name);

  const registration =
    data.registration && data.insuranceType === "Automóvel"
      ? escapeHtml(data.registration)
      : null;

  const submittedAt = new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Lisbon",
  }).format(new Date());

  const registrationRow = registration
    ? `
      <tr>
        <td
          style="
            padding: 14px 16px;
            border-bottom: 1px solid #e5e7eb;
            color: #64748b;
            font-size: 14px;
            width: 42%;
          "
        >
          Matrícula
        </td>

        <td
          style="
            padding: 14px 16px;
            border-bottom: 1px solid #e5e7eb;
            color: #0f172a;
            font-size: 14px;
            font-weight: 700;
          "
        >
          ${registration}
        </td>
      </tr>
    `
    : "";

  await transporter.sendMail({
    from: `"Seguros Chat" <${emailUser}>`,
    to: emailUser,
    replyTo: emailUser,
    subject: `Novo pedido de seguro — ${data.insuranceType}`,
    text: `
Novo pedido de seguro

Tipo de seguro: ${data.insuranceType}
${registration ? `Matrícula: ${data.registration}` : ""}
Contacto: ${data.contact}
Nome: ${data.name}
Data: ${submittedAt}
    `.trim(),
    html: `
      <!DOCTYPE html>
      <html lang="pt">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
          "
        >
          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="background-color: #f1f5f9; padding: 32px 16px;"
          >
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    max-width: 620px;
                    background-color: #ffffff;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 12px 35px rgba(15, 23, 42, 0.10);
                  "
                >
                  <tr>
                    <td
                      style="
                        background-color: #173b6c;
                        padding: 28px 32px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 8px;
                          color: #bfdbfe;
                          font-size: 13px;
                          font-weight: 700;
                          letter-spacing: 0.08em;
                          text-transform: uppercase;
                        "
                      >
                        Seguros Chat
                      </p>

                      <h1
                        style="
                          margin: 0;
                          color: #ffffff;
                          font-size: 25px;
                          line-height: 1.3;
                        "
                      >
                        Novo pedido de seguro
                      </h1>

                      <p
                        style="
                          margin: 10px 0 0;
                          color: #dbeafe;
                          font-size: 14px;
                          line-height: 1.6;
                        "
                      >
                        Foi recebido um novo contacto através do website.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px 32px;">
                      <div
                        style="
                          display: inline-block;
                          padding: 8px 14px;
                          margin-bottom: 22px;
                          background-color: #eff6ff;
                          border: 1px solid #bfdbfe;
                          border-radius: 999px;
                          color: #1d4ed8;
                          font-size: 13px;
                          font-weight: 700;
                        "
                      >
                        ${insuranceType}
                      </div>

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                          border: 1px solid #e5e7eb;
                          border-radius: 12px;
                          border-collapse: separate;
                          border-spacing: 0;
                          overflow: hidden;
                        "
                      >
                        <tr>
                          <td
                            style="
                              padding: 14px 16px;
                              border-bottom: 1px solid #e5e7eb;
                              color: #64748b;
                              font-size: 14px;
                              width: 42%;
                            "
                          >
                            Tipo de seguro
                          </td>

                          <td
                            style="
                              padding: 14px 16px;
                              border-bottom: 1px solid #e5e7eb;
                              color: #0f172a;
                              font-size: 14px;
                              font-weight: 700;
                            "
                          >
                            ${insuranceType}
                          </td>
                        </tr>

                        ${registrationRow}

                        <tr>
                            <td
                              style="
                                padding: 14px 16px;
                                border-bottom: 1px solid #e5e7eb;
                                color: #64748b;
                                font-size: 14px;
                              "
                            >
                              Nome
                            </td>

                           <td
                            style="
                              padding: 14px 16px;
                              border-bottom: 1px solid #e5e7eb;
                              color: #0f172a;
                              font-size: 14px;
                              font-weight: 700;
                            "
                          >
                            ${name}
                          </td>
                         </tr>

                        <tr>
                          <td
                            style="
                              padding: 14px 16px;
                              border-bottom: 1px solid #e5e7eb;
                              color: #64748b;
                              font-size: 14px;
                            "
                          >
                            Contacto
                          </td>

                          <td
                            style="
                              padding: 14px 16px;
                              border-bottom: 1px solid #e5e7eb;
                              color: #0f172a;
                              font-size: 16px;
                              font-weight: 700;
                            "
                          >
                            <a
                              href="tel:${contact}"
                              style="
                                color: #2563eb;
                                text-decoration: none;
                              "
                            >
                              ${contact}
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding: 14px 16px;
                              color: #64748b;
                              font-size: 14px;
                            "
                          >
                            Data do pedido
                          </td>

                          <td
                            style="
                              padding: 14px 16px;
                              color: #0f172a;
                              font-size: 14px;
                              font-weight: 600;
                            "
                          >
                            ${submittedAt}
                          </td>
                        </tr>
                      </table>

                      <div
                        style="
                          margin-top: 24px;
                          padding: 16px;
                          background-color: #f8fafc;
                          border-left: 4px solid #2563eb;
                          border-radius: 8px;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            color: #475569;
                            font-size: 14px;
                            line-height: 1.6;
                          "
                        >
                          Contacte este potencial cliente assim que possível.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td
                      style="
                        padding: 18px 32px;
                        background-color: #f8fafc;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #94a3b8;
                          font-size: 12px;
                        "
                      >
                        Mensagem enviada automaticamente pelo Seguros Chat
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}