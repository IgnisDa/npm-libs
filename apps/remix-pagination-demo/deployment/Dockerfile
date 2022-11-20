FROM node:16-alpine as base
ENV PROJECT_NAME=remix-pagination-demo \
    CYPRESS_INSTALL_BINARY=0

FROM base AS builder
RUN apk add --no-cache curl g++ make py3-pip && \
    yarn global add pnpm@7.5.0 nx@14.5.1 && \
    wget https://github.com/IgnisDa/developrs/releases/download/esteem-v1.1.8/esteem-v1.1.8-x86_64-unknown-linux-musl.tar.gz && \
    tar -xzf esteem-v1.1.8-x86_64-unknown-linux-musl.tar.gz && \
    mv esteem-v1.1.8-x86_64-unknown-linux-musl/esteem  /usr/bin
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN esteem install-isolated remix-pagination-demo
RUN nx build ${PROJECT_NAME}
RUN pnpm install --production --ignore-scripts --prefer-offline

# Production image, copy required files and run server
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/${PROJECT_NAME}/deployment/* ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production

CMD /app/start.sh
