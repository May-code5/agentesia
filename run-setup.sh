#!/bin/bash
set -euo pipefail
cd /workspace/maycode-atencion-ia
echo "== install =="
/usr/bin/npm install
echo "== db push =="
/usr/bin/npm run db:push
echo "== seed =="
/usr/bin/npm run db:seed
echo "== build =="
/usr/bin/npm run build
echo "== DONE =="
