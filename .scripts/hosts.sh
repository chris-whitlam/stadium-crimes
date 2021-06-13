#!/bin/bash

HOSTS=$AND_DIGITAL_DIR/.scripts/hosts

log() {
  echo "--> Hosts: $1"
}

curl -L https://raw.github.com/alphabetum/hosts/master/hosts -o $HOSTS --silent && chmod +x $HOSTS

echo ""
log "Adding entries to /etc/hosts..."
echo ""

declare -a hosts=(
  "api.and-digital.local"
  "ui.and-digital.local"
)

for host in ${hosts[@]}; do
  bash $HOSTS add 127.0.0.1 $host
done

echo ""
log "Hosts file setup done."
echo ""
