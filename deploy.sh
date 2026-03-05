#!/bin/bash
set -e

# ============ 配置 ============
SSH_KEY="/Users/luca/.ssh/key"
SSH_USER="MINI1"
SSH_HOST="192.168.0.228"
SSH_PORT=22
REMOTE_DIR="~/go-plus"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT_RANGE_START=9000
PORT_RANGE_END=9100

SSH_CMD="ssh -i $SSH_KEY -p $SSH_PORT $SSH_USER@$SSH_HOST"
REMOTE_ENV="export PATH=/usr/local/bin:/opt/homebrew/bin:\$PATH"

echo "========================================="
echo "  GO PLUS 部署脚本"
echo "========================================="

# ============ 1. 构建前端 ============
echo ""
echo "[1/5] 构建 frontend..."
cd "$PROJECT_DIR/frontend"
npm run build

# ============ 2. 构建管理后台 ============
echo ""
echo "[2/5] 构建 admin（base=/admin/）..."
cd "$PROJECT_DIR/admin"
npx vite build --base /admin/

# ============ 3. 查找远程可用端口 ============
echo ""
echo "[3/5] 查找远程可用端口（范围 ${PORT_RANGE_START}-${PORT_RANGE_END}）..."
AVAILABLE_PORT=$($SSH_CMD "bash -c '
for port in \$(seq $PORT_RANGE_START $PORT_RANGE_END); do
  if ! nc -z localhost \$port 2>/dev/null; then
    echo \$port
    break
  fi
done
'")

if [ -z "$AVAILABLE_PORT" ]; then
  echo "错误: 在 ${PORT_RANGE_START}-${PORT_RANGE_END} 范围内未找到可用端口"
  exit 1
fi
echo "将使用端口: $AVAILABLE_PORT"

# ============ 4. 同步文件到远程 ============
echo ""
echo "[4/5] 同步文件到远程服务器..."
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
  -e "ssh -i $SSH_KEY -p $SSH_PORT" \
  "$PROJECT_DIR/" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/"

# ============ 5. 远程构建并启动 ============
echo ""
echo "[5/5] 远程 docker-compose 构建并启动..."
$SSH_CMD "
  $REMOTE_ENV
  cd $REMOTE_DIR
  export APP_PORT=$AVAILABLE_PORT

  # 停止旧容器（如果存在）
  docker compose down 2>/dev/null || true

  # 构建并启动
  docker compose up -d --build
"

echo ""
echo "========================================="
echo "  部署完成！"
echo "  前端:    http://$SSH_HOST:$AVAILABLE_PORT"
echo "  管理后台: http://$SSH_HOST:$AVAILABLE_PORT/admin/"
echo "  API:     http://$SSH_HOST:$AVAILABLE_PORT/api/v1/"
echo "  健康检查: http://$SSH_HOST:$AVAILABLE_PORT/health"
echo "========================================="
