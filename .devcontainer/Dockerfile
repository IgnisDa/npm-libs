ARG VARIANT=16
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN su node -c "npm install -g yarn pnpm nx"


# install the esteem cli to make it easier to manage nx monorepos
RUN curl https://raw.githubusercontent.com/IgnisDa/developrs/main/packages/esteem/install.sh | sudo sh -s -- --yes ;\
    # Install tokei to count code count
    wget -O tokei.tar.gz https://github.com/XAMPPRocky/tokei/releases/latest/download/tokei-x86_64-unknown-linux-gnu.tar.gz ;\
    tar xf tokei.tar.gz -C /usr/local/bin ;\
    tokei --version
