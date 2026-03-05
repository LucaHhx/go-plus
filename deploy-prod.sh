#!/bin/bash
set -e

# ============ 配置 ============
SSH_KEY="/Users/luca/.ssh/key"
SSH_USER="root"
SSH_HOST="16.163.7.125"
SSH_PORT=2220
REMOTE_DIR="/root/go-plus"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOMAIN="pgplay.games"

SSH_CMD="ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$SSH_HOST"
SCP_CMD="scp -i $SSH_KEY -P $SSH_PORT"

echo "========================================="
echo "  GO PLUS 正式服部署脚本"
echo "  域名: $DOMAIN"
echo "========================================="

# ============ 1. 构建前端 ============
echo ""
echo "[1/6] 构建 frontend..."
cd "$PROJECT_DIR/frontend"
npm run build

# ============ 2. 构建管理后台 ============
echo ""
echo "[2/6] 构建 admin（base=/admin/）..."
cd "$PROJECT_DIR/admin"
npx vite build --base /admin/

# ============ 3. 同步项目文件到远程 ============
echo ""
echo "[3/6] 同步项目文件到远程服务器..."
$SSH_CMD "mkdir -p $REMOTE_DIR"

rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.claude' \
  --exclude 'server/server' \
  --exclude 'server/logs' \
  --exclude 'test-results' \
  --exclude 'docs' \
  --exclude 'img.png' \
  --exclude 'deploy.sh' \
  --exclude 'deploy-prod.sh' \
  -e "ssh -i $SSH_KEY -p $SSH_PORT" \
  "$PROJECT_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

# ============ 4. 部署前端静态文件 ============
echo ""
echo "[4/6] 部署前端静态文件到 /srv/www/go-plus/..."
$SSH_CMD "
  mkdir -p /srv/www/go-plus/frontend
  mkdir -p /srv/www/go-plus/admin

  # 同步前端构建产物
  rm -rf /srv/www/go-plus/frontend/*
  cp -r $REMOTE_DIR/frontend/dist/* /srv/www/go-plus/frontend/

  rm -rf /srv/www/go-plus/admin/*
  cp -r $REMOTE_DIR/admin/dist/* /srv/www/go-plus/admin/
"

# ============ 5. 签发 SSL 证书并配置 nginx ============
echo ""
echo "[5/6] 检查 SSL 证书并配置 nginx..."
$SSH_CMD "
  SSL_DIR=/srv/base/acmeout/$DOMAIN
  if [ -f \"\$SSL_DIR/fullchain.cer\" ]; then
    echo 'SSL 证书已存在，跳过签发'
  else
    echo '签发 SSL 证书...'
    export CF_Key='2b933273a61f0f2d29aa380ab9d9fca8b87c4'
    export CF_Email='bangspike90@gmail.com'

    ~/.acme.sh/acme.sh --issue --dns dns_cf -d $DOMAIN -d www.$DOMAIN --force

    mkdir -p \$SSL_DIR
    ~/.acme.sh/acme.sh --install-cert -d $DOMAIN \
      --cert-file      \$SSL_DIR/$DOMAIN.cer \
      --key-file       \$SSL_DIR/$DOMAIN.key \
      --fullchain-file \$SSL_DIR/fullchain.cer \
      --reloadcmd      'docker exec nginx nginx -s reload'

    echo 'SSL 证书签发完成'
  fi

  # 部署 nginx 配置
  cp $REMOTE_DIR/nginx.prod.conf /srv/base/conf/nginx/conf.d/goplus.conf

  # 测试并重载 nginx
  docker exec nginx nginx -t && docker exec nginx nginx -s reload
  echo 'nginx 配置已重载'
"

# ============ 6. 启动后端服务 ============
echo ""
echo "[6/6] 启动后端服务..."
$SSH_CMD "
  cd $REMOTE_DIR

  # 停止旧容器
  docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

  # 构建并启动
  docker-compose -f docker-compose.prod.yml up -d --build
"

echo ""
echo "========================================="
echo "  正式服部署完成！"
echo "  前端:     https://$DOMAIN"
echo "  管理后台:  https://$DOMAIN/admin/"
echo "  API:      https://$DOMAIN/api/v1/"
echo "  健康检查:  https://$DOMAIN/health"
echo "========================================="
