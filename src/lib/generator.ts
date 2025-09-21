import type { RequestData } from '@/app/[locale]/restful/[[...rest]]/content';

type GeneratorFunction = (data: RequestData) => string;

export const escapeString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
};

export const formatHeaders = (
  headers: { key: string; value: string }[]
): string[] => {
  return headers.map(
    (h) => `"${escapeString(h.key)}": "${escapeString(h.value)}"`
  );
};

const generators: Record<string, GeneratorFunction> = {
  curl: ({ method, url, body, headers }: RequestData) => {
    let code = `curl -X ${method.toUpperCase()} "${escapeString(url)}"`;
    headers.forEach((h) => {
      code += ` -H "${escapeString(h.key)}: ${escapeString(h.value)}"`;
    });
    if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      code += ` -d '${escapeString(body)}'`;
    }
    return code;
  },

  fetch: ({ method, url, body, headers }: RequestData) => {
    let code = `fetch('${escapeString(url)}', {\n`;
    code += `  method: '${method.toUpperCase()}',\n`;
    if (headers.length > 0) {
      code += `  headers: {\n`;
      formatHeaders(headers).forEach((h) => (code += `    ${h},\n`));
      code += `  },\n`;
    }
    if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      code += `  body: JSON.stringify(${body}),\n`;
    }
    code += `})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`;
    return code;
  },

  xhr: ({ method, url, body, headers }: RequestData) => {
    let code = `const xhr = new XMLHttpRequest();\n`;
    code += `xhr.open('${method.toUpperCase()}', '${escapeString(url)}');\n`;
    formatHeaders(headers).forEach(
      (h) => (code += `xhr.setRequestHeader(${h});\n`)
    );
    code += `xhr.onreadystatechange = function() {\n`;
    code += `  if (xhr.readyState === 4 && xhr.status === 200) {\n`;
    code += `    console.log(xhr.responseText);\n`;
    code += `  }\n`;
    code += `};\n`;
    code +=
      body && !['GET', 'HEAD'].includes(method.toUpperCase())
        ? `xhr.send('${escapeString(body)}');\n`
        : `xhr.send();\n`;
    return code;
  },

  nodejs: ({ method, url, body, headers }: RequestData) => {
    const data = body ?? 'null';
    try {
      const parsedUrl = new URL(url);
      let code = `const https = require('https');\n\n`;
      code += `const data = ${data};\n\n`;
      code += `const options = {\n`;
      code += `  hostname: '${parsedUrl.hostname}',\n`;
      code += `  port: 443,\n`;
      code += `  path: '${escapeString(parsedUrl.pathname + parsedUrl.search)}',\n`;
      code += `  method: '${method.toUpperCase()}',\n`;
      if (headers.length > 0) {
        code += `  headers: {\n`;
        formatHeaders(headers).forEach((h) => (code += `    ${h},\n`));
        code += `  },\n`;
      }
      code += `};\n\n`;
      code += `const req = https.request(options, (res) => {\n`;
      code += `  let data = '';\n`;
      code += `  res.on('data', (chunk) => data += chunk);\n`;
      code += `  res.on('end', () => console.log(JSON.parse(data)));\n`;
      code += `});\n\n`;
      code += `req.on('error', (error) => console.error(error));\n`;
      code += `if (data) req.write(data);\nreq.end();`;
      return code;
    } catch {
      return '';
    }
  },

  python: ({ method, url, body, headers }: RequestData) => {
    let code = `import requests\n\n`;
    code += `url = '${escapeString(url)}'\n`;
    code += `headers = {\n`;
    formatHeaders(headers).forEach((h) => (code += `  ${h},\n`));
    code += `}\n`;
    if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      code += `data = ${body}\n`;
      code += `response = requests.${method.toLowerCase()}(url, json=data, headers=headers)\n`;
    } else {
      code += `response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
    }
    code += `print(response.text)`;
    return code;
  },

  java: ({ method, url, body, headers }: RequestData) => {
    const escapedBody = escapeString(body);
    let code = `import java.net.URI;\n`;
    code += `import java.net.http.HttpClient;\n`;
    code += `import java.net.http.HttpRequest;\n`;
    code += `import java.net.http.HttpResponse;\n`;
    code += `import java.time.Duration;\n\n`;
    code += `public class Main {\n`;
    code += `  public static void main(String[] args) throws Exception {\n`;
    code += `    HttpClient client = HttpClient.newHttpClient();\n`;
    code += `    HttpRequest.Builder builder = HttpRequest.newBuilder()\n`;
    code += `      .uri(URI.create("${escapeString(url)}"))\n`;
    code += `      .timeout(Duration.ofSeconds(10))\n`;
    code += `      .method("${method.toUpperCase()}", HttpRequest.BodyPublishers.noBody());\n\n`;

    formatHeaders(headers).forEach(
      (h) => (code += `    builder.header(${h});\n`)
    );

    if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      code += `    builder.method("${method.toUpperCase()}", HttpRequest.BodyPublishers.ofString("${escapedBody}"));\n`;
    }

    code += `    HttpRequest request = builder.build();\n`;
    code += `    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n`;
    code += `    System.out.println(response.body());\n`;
    code += `  }\n`;
    code += `}`;
    return code;
  },

  csharp: ({ method, url, body, headers }: RequestData) => {
    const escapedBody = escapeString(body);
    let code = `using System;\n`;
    code += `using System.Net.Http;\n`;
    code += `using System.Text;\n\n`;
    code += `class Program {\n`;
    code += `  static async Task Main() {\n`;
    code += `    using (var client = new HttpClient()) {\n`;
    code += `      var request = new HttpRequestMessage(new HttpMethod("${method.toUpperCase()}"), "${escapeString(url)}");\n`;
    formatHeaders(headers).forEach(
      (h) => (code += `      request.Headers.Add(${h});\n`)
    );
    if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      code += `      request.Content = new StringContent("${escapedBody}", Encoding.UTF8, "application/json");\n`;
    }
    code += `      var response = await client.SendAsync(request);\n`;
    code += `      var responseBody = await response.Content.ReadAsStringAsync();\n`;
    code += `      Console.WriteLine(responseBody);\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `}`;
    return code;
  },

  go: ({ method, url, body, headers }: RequestData) => {
    let code = `package main\n\n`;
    code += `import (\n`;
    code += `  "bytes"\n`;
    code += `  "fmt"\n`;
    code += `  "net/http"\n`;
    code += `  "io"\n`;
    code += `)\n\n`;
    code += `func main() {\n`;
    code += `  url := "${escapeString(url)}"\n`;
    code += `  method := "${method.toUpperCase()}"\n`;
    code += `  client := &http.Client{}\n`;
    code += `  req, err := http.NewRequest(method, url, nil)\n`;
    code += `  if err != nil {\n`;
    code += `    panic(err)\n`;
    code += `  }\n`;
    formatHeaders(headers).forEach(
      (h) => (code += `  req.Header.Set(${h});\n`)
    );
    if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
      code += `  body := bytes.NewBuffer([]byte(${JSON.stringify(body)}))\n`;
      code += `  req.Body = body\n`;
    }
    code += `  resp, err := client.Do(req)\n`;
    code += `  if err != nil {\n`;
    code += `    panic(err)\n`;
    code += `  }\n`;
    code += `  defer resp.Body.Close()\n`;
    code += `  bodyBytes, _ := io.ReadAll(resp.Body)\n`;
    code += `  fmt.Println(string(bodyBytes))\n`;
    code += `}`;
    return code;
  },
};

export default function generateCode(
  requestData: RequestData,
  language: string
): string {
  if (!requestData.url.trim()) return '';

  const generator = generators[language];
  if (!generator) return '';

  return generator(requestData);
}
