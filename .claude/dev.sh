#!/bin/sh
NODE_DIR="/Applications/Cursor.app/Contents/Resources/app/resources/helpers"
export PATH="$NODE_DIR:$PATH"
cd "/Users/fstekolshch/Desktop/Claude Playground/Spring"
exec "$NODE_DIR/node" node_modules/.bin/next dev
