FROM ubuntu:jammy

ARG DEBIAN_FRONTEND=noninteractive

ARG user=miktex
ARG group=miktex
ARG uid=1000
ARG gid=1000

ARG miktex_home=/var/lib/miktex
ARG miktex_work=/miktex/work

RUN groupadd -g ${gid} ${group} \
    && useradd -d "${miktex_home}" -u ${uid} -g ${gid} -m -s /bin/bash ${user}

RUN    apt-get update \
    && apt-get install -y --no-install-recommends \
           apt-transport-https \
           ca-certificates \
           curl \
           dirmngr \
           ghostscript \
           gnupg \
           gosu \
           perl

RUN curl -fsSL https://miktex.org/download/key | tee /usr/share/keyrings/miktex-keyring.asc > /dev/null \
    && echo "deb [signed-by=/usr/share/keyrings/miktex-keyring.asc] https://miktex.org/download/ubuntu jammy universe" | tee /etc/apt/sources.list.d/miktex.list

RUN    apt-get update -y \
    && apt-get install -y --no-install-recommends \
           miktex

# nvm requirements
RUN apt-get update
RUN echo "y" | apt-get install curl
# nvm env vars
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
# IMPORTANT: set the exact version
ENV NODE_VERSION v20.9.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
# add node and npm to the PATH
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH
RUN npm -v
RUN node -v

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app files
COPY . .

# Build the Next.js app
RUN npm run build

# USER ${user}

RUN    miktexsetup finish \
    && initexmf --set-config-value=[MPM]AutoInstall=1 \
    && miktex --admin packages update \
    && miktex --admin packages install amsfonts

# USER root
ENV PATH=/var/lib/miktex/bin:${PATH}

# Expose the port on which your Next.js app runs
EXPOSE 3000

# Command to run the Next.js application
CMD ["npm", "start"]