#!/bin/sh
# Add /projects/baanyard/ → 127.0.0.1:8502 on the existing campong.online vhost.
# Does not replace other project locations. Does not print keys.
set -e

APP_DIR="${DEPLOY_PATH:-/opt/baanyard}"
SNIP_SRC="$APP_DIR/deploy/nginx-host-proxy.conf"
SNIP_DEST="/etc/nginx/snippets/campong-baanyard.conf"
VHOST="/etc/nginx/sites-available/campong.online"
INCLUDE_LINE='include /etc/nginx/snippets/campong-baanyard.conf;'

if [ ! -f "$SNIP_SRC" ]; then
	echo "ERROR: missing $SNIP_SRC"
	exit 1
fi

if ! command -v nginx >/dev/null 2>&1; then
	echo "ERROR: nginx is not installed on the host"
	exit 1
fi

mkdir -p /etc/nginx/snippets
cp -f "$SNIP_SRC" "$SNIP_DEST"

if [ ! -f "$VHOST" ]; then
	echo "ERROR: missing $VHOST — shared campong vhost required."
	exit 1
fi

if ! grep -q 'campong-baanyard.conf' "$VHOST"; then
	if grep -q 'client_max_body_size' "$VHOST"; then
		sed -i "/client_max_body_size/a\\
    $INCLUDE_LINE
" "$VHOST"
	else
		echo "ERROR: could not find insertion point in $VHOST"
		exit 1
	fi
fi

nginx -t
if command -v systemctl >/dev/null 2>&1; then
	systemctl reload nginx || systemctl restart nginx
else
	nginx -s reload || nginx
fi

echo "Host nginx: /projects/baanyard/ → 127.0.0.1:8502 (HTTPS on campong.online)"
