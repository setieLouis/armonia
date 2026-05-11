FROM debian:bookworm-slim

# Dipendenze base
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    unzip \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Installa fnm
ENV FNM_DIR="/root/.fnm"

RUN curl -fsSL https://fnm.vercel.app/install | bash

# Aggiunge fnm al PATH
ENV PATH="${FNM_DIR}:${FNM_DIR}/aliases/default/bin:${PATH}"

# Installa Node LTS
#RUN bash -c "source /root/.bashrc && fnm install --lts && fnm default lts-latest"

# Verifica
#RUN node -v && npm -v && fnm --version

CMD ["/bin/bash"]