# Assignment 6 - AWS and OpenAI

This project upgrades the portfolio into an AI-enabled site with a "Chat with my Resume" feature.

## What is implemented

- Frontend floating widget: "Ask Anything About Me"
- Frontend sends questions to API Gateway endpoint
- AWS Lambda handler retrieves OpenAI key from AWS Secrets Manager
- Lambda reads local resume context file and uses it for grounded responses
- CI/CD security audit workflow in GitHub Actions with two mandatory checks:
  - Hardcoded secret scan with Gitleaks
  - Dependency vulnerability audit with npm audit
  - Extra policy gate blocking eval/new Function usage

## Files added

- `app.js`
- `amplify.yml`
- `.github/workflows/security_audit.yml`
- `lambda/index.mjs`
- `lambda/resume-context.txt`
- `lambda/package.json`
- `lambda/test/lambda.test.mjs`

## Local test commands

```powershell
npm --prefix lambda install
npm --prefix lambda test
npm --prefix lambda audit --audit-level=high
```

## AWS CLI deployment steps

### 1) Create and store the OpenAI key in Secrets Manager

```powershell
aws secretsmanager create-secret \
  --name assignment6/openai \
  --description "OpenAI key for resume chatbot" \
  --secret-string '{"OPENAI_API_KEY":"REPLACE_WITH_REAL_KEY"}'
```

If already created:

```powershell
aws secretsmanager put-secret-value \
  --secret-id assignment6/openai \
  --secret-string '{"OPENAI_API_KEY":"REPLACE_WITH_REAL_KEY"}'
```

### 2) Package and create/update Lambda

```powershell
npm --prefix lambda install
Compress-Archive -Path lambda\\* -DestinationPath lambda.zip -Force
```

Create Lambda (first time):

```powershell
aws lambda create-function \
  --function-name resume-chat-lambda \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://lambda.zip \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_LAMBDA_ROLE \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables={OPENAI_SECRET_ID=assignment6/openai,OPENAI_MODEL=gpt-4o-mini,RESUME_CONTEXT_FILE=./resume-context.txt}
```

Update Lambda (existing function):

```powershell
aws lambda update-function-code \
  --function-name resume-chat-lambda \
  --zip-file fileb://lambda.zip

aws lambda update-function-configuration \
  --function-name resume-chat-lambda \
  --environment Variables={OPENAI_SECRET_ID=assignment6/openai,OPENAI_MODEL=gpt-4o-mini,RESUME_CONTEXT_FILE=./resume-context.txt}
```

### 3) Create HTTP API Gateway and integration

```powershell
$apiId = aws apigatewayv2 create-api \
  --name resume-chat-api \
  --protocol-type HTTP \
  --query ApiId --output text

$integrationId = aws apigatewayv2 create-integration \
  --api-id $apiId \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:resume-chat-lambda \
  --payload-format-version 2.0 \
  --query IntegrationId --output text

aws apigatewayv2 create-route --api-id $apiId --route-key "POST /chat" --target "integrations/$integrationId"
aws apigatewayv2 create-stage --api-id $apiId --stage-name prod --auto-deploy
aws lambda add-permission --function-name resume-chat-lambda --statement-id apigw-chat --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:us-east-1:YOUR_ACCOUNT_ID:$apiId/*/*/chat"
```

Your endpoint format:

```text
https://$apiId.execute-api.us-east-1.amazonaws.com/prod/chat
```

### 4) Set frontend API endpoint

In `app.js`, replace placeholder `CHAT_API_URL` with your real API Gateway URL or define `window.CHAT_API_URL` before loading `app.js`.

### 5) Amplify hosting

- Push this repo to GitHub (already connected remote)
- In AWS Amplify Console: New app -> Host web app -> connect repo
- Build settings can use `amplify.yml` in root

## Required submission checklist

- Amplify Hosting Site URL
- GitHub Repository URL
- Screenshot: Lambda console code showing Secrets Manager + OpenAI call
- Screenshot: GitHub Actions successful security audit run
- Screenshot: GitHub Actions failed security audit run (example: commit test string like `sk-test-123` and show failing check)
