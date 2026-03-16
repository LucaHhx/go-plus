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
IMAGE_NAME="go-plus-server"
IMAGE_TAR="/tmp/${IMAGE_NAME}.tar.gz"

SSH_CMD="ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$SSH_HOST"

echo "========================================="
echo "  GO PLUS 正式服部署脚本（本地编译模式）"
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

# ============ 3. 本地构建 Docker 镜像 ============
echo ""
echo "[3/6] 本地构建 Docker 镜像（目标: linux/amd64）..."
cd "$PROJECT_DIR"
docker buildx build \
  --platform linux/amd64 \
  --load \
  -t "$IMAGE_NAME:latest" \
  ./server

echo "  镜像构建完成，导出中..."
docker save "$IMAGE_NAME:latest" | gzip > "$IMAGE_TAR"
echo "  镜像大小: $(du -h "$IMAGE_TAR" | cut -f1)"

# ============ 4. 上传镜像 + 前端文件到服务器 ============
echo ""
echo "[4/6] 上传镜像和前端文件到服务器..."
$SSH_CMD "mkdir -p $REMOTE_DIR"

# 并行上传：镜像 + 前端文件 + nginx 配置
rsync -avz --progress \
  -e "ssh -i $SSH_KEY -p $SSH_PORT" \
  "$IMAGE_TAR" "$SSH_USER@$SSH_HOST:/tmp/"

rsync -avz --delete \
  -e "ssh -i $SSH_KEY -p $SSH_PORT" \
  "$PROJECT_DIR/frontend/dist/" "$SSH_USER@$SSH_HOST:/srv/www/go-plus/frontend/"

rsync -avz --delete \
  -e "ssh -i $SSH_KEY -p $SSH_PORT" \
  "$PROJECT_DIR/admin/dist/" "$SSH_USER@$SSH_HOST:/srv/www/go-plus/admin/"

# 上传 nginx 配置和 docker-compose
rsync -avz \
  -e "ssh -i $SSH_KEY -p $SSH_PORT" \
  "$PROJECT_DIR/nginx.prod.conf" \
  "$PROJECT_DIR/docker-compose.prod.yml" \
  "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

# 清理本地临时文件
rm -f "$IMAGE_TAR"

# ============ 5. 配置 nginx ============
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

# ============ 6. 加载镜像并启动服务 ============
echo ""
echo "[6/6] 加载镜像并启动后端服务..."
$SSH_CMD "
  cd $REMOTE_DIR

  # 加载镜像（无需编译）
  echo '加载 Docker 镜像...'
  docker load < /tmp/${IMAGE_NAME}.tar.gz
  rm -f /tmp/${IMAGE_NAME}.tar.gz

  # 停止旧容器
  docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

  # 直接启动（不需要 --build）
  docker-compose -f docker-compose.prod.yml up -d

  echo '服务已启动'
"

echo ""
echo "========================================="
echo "  正式服部署完成！"
echo "  前端:     https://$DOMAIN"
echo "  管理后台:  https://$DOMAIN/admin/"
echo "  API:      https://$DOMAIN/api/v1/"
echo "  健康检查:  https://$DOMAIN/health"
echo "========================================="
