# Shell脚本编程

Linux Shell脚本编程入门指南

## 🐚 Shell简介

### 什么是Shell
Shell是Linux系统的命令行解释器，它为用户提供了与操作系统内核交互的接口。Shell脚本是一系列Shell命令的集合，可以自动化执行复杂的任务。

### 常见的Shell
- **Bash**：最常用的Shell，Linux默认Shell
- **Zsh**：功能强大的Shell，macOS默认Shell
- **Fish**：用户友好的Shell
- **Dash**：轻量级的Shell

## 📝 基础语法

### Shebang行
```bash
#!/bin/bash
# 指定脚本解释器
```

### 变量定义
```bash
# 变量定义（注意等号两边不能有空格）
NAME="World"
NUMBER=42
PATH_TO_FILE="/home/user/file.txt"

# 使用变量
echo "Hello, $NAME!"
echo "Number is ${NUMBER}"
```

### 命令替换
```bash
# 方法1：使用反引号
CURRENT_DATE=`date`

# 方法2：使用$()（推荐）
CURRENT_USER=$(whoami)
FILE_COUNT=$(ls | wc -l)
```

## 🔍 条件判断

### if语句
```bash
#!/bin/bash

if [ $# -eq 0 ]; then
    echo "没有提供参数"
elif [ $# -eq 1 ]; then
    echo "提供了一个参数: $1"
else
    echo "提供了多个参数"
fi
```

### 常用测试条件
```bash
# 文件测试
[ -f file ]    # 文件存在且为普通文件
[ -d dir ]     # 目录存在
[ -r file ]    # 文件可读
[ -w file ]    # 文件可写
[ -x file ]    # 文件可执行

# 字符串测试
[ -z "$str" ]  # 字符串为空
[ -n "$str" ]  # 字符串非空
[ "$a" = "$b" ] # 字符串相等

# 数值比较
[ $a -eq $b ]  # 等于
[ $a -ne $b ]  # 不等于
[ $a -lt $b ]  # 小于
[ $a -gt $b ]  # 大于
[ $a -le $b ]  # 小于等于
[ $a -ge $b ]  # 大于等于
```

## 🔄 循环结构

### for循环
```bash
# 遍历列表
for item in apple banana cherry; do
    echo "水果: $item"
done

# 遍历文件
for file in *.txt; do
    echo "处理文件: $file"
done

# C风格for循环
for ((i=1; i<=10; i++)); do
    echo "数字: $i"
done
```

### while循环
```bash
# while循环
counter=1
while [ $counter -le 5 ]; do
    echo "计数: $counter"
    ((counter++))
done

# 读取文件内容
while read line; do
    echo "行内容: $line"
done < input.txt
```

### until循环
```bash
# until循环（条件为假时执行）
counter=1
until [ $counter -gt 5 ]; do
    echo "计数: $counter"
    ((counter++))
done
```

## 📦 函数定义

### 基本函数
```bash
# 函数定义
function greet() {
    echo "Hello, $1!"
}

# 或者
greet() {
    echo "Hello, $1!"
}

# 函数调用
greet "World"
greet "Linux"
```

### 带返回值的函数
```bash
# 返回数值
add_numbers() {
    local num1=$1
    local num2=$2
    local result=$((num1 + num2))
    return $result
}

add_numbers 5 3
echo "结果: $?"

# 返回字符串（通过echo）
get_timestamp() {
    echo $(date +"%Y-%m-%d %H:%M:%S")
}

timestamp=$(get_timestamp)
echo "当前时间: $timestamp"
```

## 📋 实用示例

### 备份脚本
```bash
#!/bin/bash

# 简单备份脚本
SOURCE_DIR="/home/user/documents"
BACKUP_DIR="/backup"
DATE=$(date +"%Y%m%d_%H%M%S")

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 创建备份
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"

if [ $? -eq 0 ]; then
    echo "备份成功: backup_$DATE.tar.gz"
else
    echo "备份失败"
    exit 1
fi
```

### 系统监控脚本
```bash
#!/bin/bash

# 系统监控脚本
echo "=== 系统监控报告 ==="
echo "时间: $(date)"
echo ""

echo "=== CPU使用率 ==="
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//'

echo ""
echo "=== 内存使用情况 ==="
free -h

echo ""
echo "=== 磁盘使用情况 ==="
df -h

echo ""
echo "=== 网络连接 ==="
netstat -tuln | grep LISTEN | head -5
```

### 文件处理脚本
```bash
#!/bin/bash

# 批量文件重命名
for file in *.jpg; do
    if [ -f "$file" ]; then
        # 获取文件名（不含扩展名）
        basename=$(basename "$file" .jpg)
        # 重命名为带时间戳的文件
        mv "$file" "${basename}_$(date +%Y%m%d).jpg"
        echo "重命名: $file -> ${basename}_$(date +%Y%m%d).jpg"
    fi
done
```

## 🔧 高级特性

### 数组
```bash
# 数组定义
fruits=("apple" "banana" "cherry")

# 数组访问
echo "第一个水果: ${fruits[0]}"
echo "所有水果: ${fruits[@]}"
echo "数组长度: ${#fruits[@]}"

# 数组遍历
for fruit in "${fruits[@]}"; do
    echo "水果: $fruit"
done
```

### 字符串操作
```bash
text="Hello World"

# 字符串长度
echo "长度: ${#text}"

# 字符串截取
echo "前5个字符: ${text:0:5}"
echo "从第6个字符开始: ${text:6}"

# 字符串替换
echo "替换: ${text/World/Linux}"
echo "全部替换: ${text//l/L}"
```

### 错误处理
```bash
#!/bin/bash

# 设置错误时退出
set -e

# 错误处理函数
error_exit() {
    echo "错误: $1" >&2
    exit 1
}

# 使用错误处理
cp source.txt destination.txt || error_exit "文件复制失败"

# 捕获命令输出和错误
if ! output=$(command_that_might_fail 2>&1); then
    echo "命令执行失败: $output"
    exit 1
fi
```

## 🎯 最佳实践

### 代码规范
1. **使用有意义的变量名**
2. **添加注释说明**
3. **检查参数和错误**
4. **使用local声明局部变量**

### 安全考虑
```bash
# 使用双引号避免单词分割
echo "$variable"

# 检查变量是否定义
if [ -z "$REQUIRED_VAR" ]; then
    echo "错误: REQUIRED_VAR 未定义"
    exit 1
fi

# 使用绝对路径
/bin/rm -f "$file"
```

### 调试技巧
```bash
# 调试模式
set -x  # 显示执行的命令
set +x  # 关闭调试模式

# 检查语法
bash -n script.sh

# 详细执行
bash -x script.sh
```

## 📚 学习资源

### 推荐书籍
- 《Linux Shell脚本攻略》
- 《Shell脚本学习指南》
- 《高级Bash脚本编程指南》

### 在线资源
- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/)
- [ShellCheck](https://www.shellcheck.net/) - 脚本检查工具
- [Explainshell](https://explainshell.com/) - 命令解释

### 练习建议
1. **从简单脚本开始**：文件操作、文本处理
2. **逐步增加复杂度**：添加条件判断和循环
3. **学习实用工具**：awk、sed、grep等
4. **编写自动化脚本**：系统管理、备份等任务

## 🔗 相关链接

- [Linux基础](/linux/basics.html)
- [Linux命令](/linux/commands/)
- [Linux学习笔记](/linux/notes/)

记住，Shell脚本编程的关键是多练习，从实际需求出发，逐步提高编程技能！
