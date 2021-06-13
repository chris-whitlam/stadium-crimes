if [ ! -e ".ssl/ca.crt" ]; then
  echo "Certificates could not be located, exiting"
fi

SHELL_NAME=$(uname)
USER_NAME=$(whoami)

if [ $USER_NAME != "root" ]; then
  export PREFIX="sudo"
fi

if [ $SHELL_NAME = "Darwin" ]; then
  echo "MacOS System Detected, Adding certificate to Keychain"
  $PREFIX security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain .ssl/ca.crt

  exit
fi

if [ $SHELL_NAME = "Linux" ]; then
  echo "Linux System Detected"

  if [[ $SHELL_NAME == *"$amzn"* ]]; then
    echo "Amazon Linux System Detected"

    echo "Adding CA certificates..."
    $PREFIX cp .ssl/ca.crt /etc/pki/ca-trust/source/anchors/ca.crt
    $PREFIX update-ca-trust
    echo "Done..."

    exit
  fi

  echo "Adding Certificate for curl, get etc..."
  $PREFIX cp .ssl/ca.crt /usr/local/share/ca-certificates/ca.crt
  $PREFIX update-ca-certificates

  echo "Adding Certificate to Chrome, Firefox etc.."
  $PREFIX apt-get install libnss3-tools

  for certDB in $(find ~/ -name "cert9.db")
  do
    certdir=$(dirname ${certDB});
    certutil -A -n "ANDDigital Root CA" -t "TCu,Cu,Tu" -i ".ssl/ca.crt" -d sql:${certdir}
  done

  exit
fi
