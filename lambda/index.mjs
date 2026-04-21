import { readFile } from "node:fs/promises";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const defaultCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
};

export async function getSecretValue(client, secretId) {
  const command = new GetSecretValueCommand({ SecretId: secretId });
  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error("Secret value is empty or binary");
  }

  try {
    const secretPayload = JSON.parse(response.SecretString);
    return secretPayload.OPENAI_API_KEY;
  } catch {
    const fallbackMatch = response.SecretString.match(/OPENAI_API_KEY\s*[:=]\s*\"?([^\",}\s]+)\"?/);
    if (fallbackMatch?.[1]) {
      return fallbackMatch[1];
    }
    throw new Error("Could not parse OPENAI_API_KEY from secret payload.");
  }
}

export async function getResumeContext(filePath) {
  return readFile(filePath, "utf8");
}

export function getQuestionFromEvent(event) {
  if (!event?.body) {
    throw new Error("Request body is required.");
  }

  const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  const question = (body.question || "").trim();

  if (!question) {
    throw new Error("Question is required.");
  }

  return question;
}

export async function askOpenAI({ apiKey, model, question, context, fetchImpl = fetch }) {
  const systemPrompt = [
    "You are an assistant answering questions about Ronit Pawar's resume.",
    "Only answer using the provided resume context.",
    "If the answer is not in context, say you do not have that information yet."
  ].join(" ");

  const response = await fetchImpl("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Resume Context:\n${context}\n\nQuestion: ${question}`
        }
      ]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI API request failed (${response.status}): ${details}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content?.trim() || "I could not find an answer.";
}

export async function handler(event) {
  if (event?.requestContext?.http?.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: defaultCorsHeaders,
      body: JSON.stringify({ ok: true })
    };
  }

  try {
    const region = process.env.AWS_REGION || "us-east-1";
    const secretId = process.env.OPENAI_SECRET_ID;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const contextFile = process.env.RESUME_CONTEXT_FILE || "./resume-context.txt";

    if (!secretId) {
      throw new Error("OPENAI_SECRET_ID environment variable is missing.");
    }

    const question = getQuestionFromEvent(event);
    const secretClient = new SecretsManagerClient({ region });
    const apiKey = await getSecretValue(secretClient, secretId);

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not found in secret payload.");
    }

    const resumeContext = await getResumeContext(contextFile);
    const answer = await askOpenAI({
      apiKey,
      model,
      question,
      context: resumeContext
    });

    return {
      statusCode: 200,
      headers: {
        ...defaultCorsHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...defaultCorsHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: error.message })
    };
  }
}
