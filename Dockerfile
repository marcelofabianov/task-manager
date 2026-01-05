FROM oven/bun:canary-alpine

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 8080

CMD ["bun", "run", "--hot", "src/main/server.ts"]
