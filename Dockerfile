FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

# Dipendenze base (solo quelle che ti servono davvero)
RUN apt-get update && apt-get install -y \
    git \
    git-flow \
    curl \
    ca-certificates \
    unzip \
    bash \
    && rm -rf /var/lib/apt/lists/*

# CA aziendale (McAfee proxy)
COPY ./cert/mcafee.crt /usr/local/share/ca-certificates/mcafee.crt
RUN update-ca-certificates

# 🔐 Node/npm devono fidarsi della CA aziendale
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/mcafee.crt

# 🔐 npm (molto importante nel tuo ambiente)
RUN npm config set cafile /usr/local/share/ca-certificates/mcafee.crt

# install globale
RUN npm install -g @google/gemini-cli

CMD ["/bin/bash"]