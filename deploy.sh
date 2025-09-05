#!/bin/bash

# T-DT 网站自动化部署脚本
# 编译项目并将dist文件夹内容部署到服务器

set -e  # 遇到错误时立即退出

# 配置信息
SERVER_USER="lighthouse"
SERVER_HOST="neutdt.cn"
SERVER_PATH="/www/wwwroot/www.neutdt.cn"
LOCAL_DIST_PATH="./dist/"

# 颜色输出函数
print_info() {
    echo -e "\033[32m[INFO]\033[0m $1"
}

print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[33m[WARNING]\033[0m $1"
}

# 检查必要的工具
check_dependencies() {
    print_info "检查部署依赖..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装，请先安装 Node.js 和 npm"
        exit 1
    fi
    
    if ! command -v rsync &> /dev/null; then
        print_error "rsync 未安装，请先安装 rsync"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        print_error "ssh 未安装，请先安装 openssh-client"
        exit 1
    fi
    
    print_info "依赖检查完成"
}

# 测试服务器连接
test_server_connection() {
    print_info "测试服务器连接..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes ${SERVER_USER}@${SERVER_HOST} exit &> /dev/null; then
        print_info "服务器连接正常"
    else
        print_error "无法连接到服务器 ${SERVER_USER}@${SERVER_HOST}"
        print_warning "请确保："
        echo "1. SSH密钥已配置并添加到服务器"
        echo "2. 服务器地址和用户名正确"
        echo "3. 服务器SSH服务正在运行"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    print_info "安装项目依赖..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        print_info "依赖已存在，跳过安装"
    fi
}

# 编译项目
build_project() {
    print_info "开始编译项目..."
    
    # 清理旧的构建文件
    if [ -d "$LOCAL_DIST_PATH" ]; then
        print_info "清理旧的构建文件..."
        rm -rf "$LOCAL_DIST_PATH"
    fi
    
    # 构建项目
    npm run build
    
    if [ ! -d "$LOCAL_DIST_PATH" ]; then
        print_error "构建失败，dist 目录不存在"
        exit 1
    fi
    
    print_info "项目编译完成"
}

# 部署到服务器
deploy_to_server() {
    print_info "开始部署到服务器..."
    
    # 创建远程目录（如果不存在）
    ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"
    
    # 备份当前部署（可选）
    # print_info "创建服务器备份..."
    # ssh ${SERVER_USER}@${SERVER_HOST} "
    #     if [ -d '${SERVER_PATH}/backup' ]; then
    #         rm -rf '${SERVER_PATH}/backup'
    #     fi
    #     if [ -d '${SERVER_PATH}' ] && [ \"\$(ls -A ${SERVER_PATH} 2>/dev/null | grep -v backup)\" ]; then
    #         mkdir -p '${SERVER_PATH}/backup'
    #         find '${SERVER_PATH}' -maxdepth 1 -type f -exec mv {} '${SERVER_PATH}/backup/' \;
    #         find '${SERVER_PATH}' -maxdepth 1 -type d ! -name 'backup' ! -path '${SERVER_PATH}' -exec mv {} '${SERVER_PATH}/backup/' \;
    #     fi
    # "
    
    # 使用rsync同步文件
    print_info "同步文件到服务器..."
    rsync -avz \
        --exclude='.DS_Store' \
        --exclude='Thumbs.db' \
        --exclude='.git*' \
        "${LOCAL_DIST_PATH}" \
        "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"
    
    print_info "文件同步完成"
}

# 验证部署
verify_deployment() {
    print_info "验证部署结果..."
    
    # 检查远程文件
    ssh ${SERVER_USER}@${SERVER_HOST} "
        if [ -f '${SERVER_PATH}/index.html' ]; then
            echo '部署验证：index.html 存在'
            ls -la '${SERVER_PATH}' | head -10
        else
            echo '部署验证失败：index.html 不存在'
            exit 1
        fi
    "
}

# 主函数
main() {
    print_info "开始 T-DT 网站部署流程..."
    print_info "目标服务器: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}"
    echo
    
    # 执行部署步骤
    # check_dependencies
    # test_server_connection
    # install_dependencies
    build_project
    deploy_to_server
    # verify_deployment
    
    print_info "🎉 部署完成！"
    print_info "访问网站: https://www.neutdt.cn"
}

# 脚本入口
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build-only")
        print_info "仅编译模式..."
        check_dependencies
        install_dependencies
        build_project
        print_info "编译完成"
        ;;
    "upload-only")
        print_info "仅上传模式..."
        check_dependencies
        test_server_connection
        if [ ! -d "$LOCAL_DIST_PATH" ]; then
            print_error "dist 目录不存在，请先运行编译"
            exit 1
        fi
        deploy_to_server
        verify_deployment
        print_info "上传完成"
        ;;
    "help"|"-h"|"--help")
        echo "T-DT 网站部署脚本"
        echo ""
        echo "用法:"
        echo "  ./deploy.sh [命令]"
        echo ""
        echo "命令:"
        echo "  deploy      完整部署（默认）：编译 + 上传"
        echo "  build-only  仅编译项目"
        echo "  upload-only 仅上传已编译的文件"
        echo "  help        显示此帮助信息"
        echo ""
        echo "环境要求:"
        echo "  - Node.js 和 npm"
        echo "  - rsync"
        echo "  - ssh（已配置密钥认证）"
        ;;
    *)
        print_error "未知命令: $1"
        echo "使用 './deploy.sh help' 查看可用命令"
        exit 1
        ;;
esac
