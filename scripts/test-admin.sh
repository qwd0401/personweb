#!/bin/bash

# 设置基础URL和存储token的变量
BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "开始管理员API测试..."
echo "====================="

# 1. 测试管理员登录
echo "1. 测试管理员登录"
echo "1.1 成功登录测试"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123456"
  }' \
  $BASE_URL/admin/login)
echo $LOGIN_RESPONSE | python3 -m json.tool

# 提取token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "1.2 失败登录测试（错误密码）"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "wrongpassword"
  }' \
  $BASE_URL/admin/login | python3 -m json.tool

# 2. 测试项目管理
echo -e "\n2. 测试项目管理"
echo "2.1 创建新项目"
PROJECT_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "测试项目",
    "description": "这是一个测试项目",
    "technologies": ["React", "Node.js"],
    "outcome": "测试成功"
  }' \
  $BASE_URL/admin/projects)
echo $PROJECT_RESPONSE | python3 -m json.tool

# 提取项目ID
PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')

echo "2.2 更新项目"
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "更新后的测试项目",
    "description": "这是更新后的测试项目",
    "technologies": ["React", "Node.js", "MongoDB"],
    "outcome": "更新成功"
  }' \
  $BASE_URL/admin/projects/$PROJECT_ID | python3 -m json.tool

echo "2.3 删除项目"
curl -s -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/admin/projects/$PROJECT_ID | python3 -m json.tool

# 3. 测试博客管理
echo -e "\n3. 测试博客管理"
echo "3.1 创建新博客"
BLOG_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "测试博客",
    "content": "这是一篇测试博客",
    "tags": ["测试", "博客"]
  }' \
  $BASE_URL/admin/blogs)
echo $BLOG_RESPONSE | python3 -m json.tool

# 提取博客ID
BLOG_ID=$(echo $BLOG_RESPONSE | grep -o '"_id":"[^"]*' | grep -o '[^"]*$')

echo "3.2 更新博客"
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "更新后的测试博客",
    "content": "这是更新后的测试博客",
    "tags": ["测试", "博客", "更新"]
  }' \
  $BASE_URL/admin/blogs/$BLOG_ID | python3 -m json.tool

echo "3.3 删除博客"
curl -s -X DELETE \
  -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/admin/blogs/$BLOG_ID | python3 -m json.tool

# 4. 测试未授权访问
echo -e "\n4. 测试未授权访问"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "未授权测试",
    "content": "这是未授权测试",
    "tags": ["测试"]
  }' \
  $BASE_URL/admin/blogs | python3 -m json.tool 