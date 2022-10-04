FROM archlinux

ENV UUID=1000
ENV GUID=${UUID}
ENV USERNAME=vscode

RUN pacman -Syyu --noconfirm reflector ;\
    reflector --latest 20 --protocol https --sort rate --save /etc/pacman.d/mirrorlist ;\
    pacman -S --noconfirm --needed base-devel git sudo

RUN groupadd -g ${GUID} ${USERNAME} ; \
    useradd -ms /bin/bash ${USERNAME} -u ${UUID} -g ${USERNAME} -g wheel ; \
    echo "ALL ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} ;\
    chmod 0440 /etc/sudoers.d/${USERNAME}

RUN pacman -S --noconfirm nodejs npm fish curl wget

RUN set -eu ;\
    npm install --global pnpm

USER $USERNAME
