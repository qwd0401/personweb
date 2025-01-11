#!/bin/bash

# 设置基础URL
BASE_URL="http://localhost:3000/api"

echo "开始API测试..."
echo "-------------------"

echo "1. 测试获取所有项目"
curl -s $BASE_URL/projects | json_pp
echo -e "\n-------------------"

echo "2. 测试获取所有博客"
curl -s $BASE_URL/blogs | json_pp
echo -e "\n-------------------"

echo "3. 测试发送联系消息 (成功场景)"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "李四",
    "email": "lisi@example.com",
    "message": "测试消息"
  }' \
  $BASE_URL/contact | json_pp
echo -e "\n-------------------"

echo "4. 测试发送联系消息 (失败场景 - 无效邮箱)"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "李四",
    "email": "invalid-email",
    "message": "测试消息"
  }' \
  $BASE_URL/contact | json_pp
echo -e "\n-------------------" 