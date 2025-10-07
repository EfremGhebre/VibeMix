import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SupportEmailRequest {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, category, subject, message }: SupportEmailRequest = await req.json();

    console.log("Received support email request:", { name, email, category, subject });

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send email to your private email
    const emailResponse = await resend.emails.send({
      from: "VibeMix Support <support@vibemix.app>",
      to: ["efremg69@gmail.com"], // Replace with your actual email
      replyTo: email,
      subject: `[${category.toUpperCase()}] ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending support email:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
