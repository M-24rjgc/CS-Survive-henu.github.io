### 查找属于 jacques ⽤⼾所属⽂件，并拷⻉到/root/findfiles/
```bash
mkdir /root/findfiles
find / -user jacques
find / -user jacques -exec cp -a {} /root/findfiles \;
ll /root/findfiles/
```


# find --help

Usage: find [-H] [-L] [-P] [-Olevel] [-D debugopts] [path...] [expression]  

  使用时：find   ==路径==   ==限定词== 【动词】
  如：find / -user jacques -exec cp -a {} /root/findfiles  \\ ;
  
  1. **find /**：
    
    - 这是`find`命令的开始，`/`表示从根目录开始搜索。
2. **-user jacques**：
    
    - 这个选项是用来指定搜索具有特定所有者（用户）的文件。在这种情况下，它会查找所有所有者为“jacques”的文件。
3. **-exec cp -a {} /root/findfiles ;**：
    
    - `-exec` (Execute执行)是一个操作选项，它允许你对每个匹配的文件执行一个指定的命令。
    - `-exec command {} \;` 用于对每个匹配的文件执行指定的命令。固定格式。
    - `cp -a` 是复制命令，`-a` 参数表示归档模式，它会保留文件的属性（例如权限、时间戳等）。
    - `{}` 是一个特殊标记，它表示匹配到的每一个文件。在 `-exec` 选项中，`{}` 用于插入匹配到的文件名。
    - `/root/findfiles` 是目标目录，所有匹配的文件都会被复制到这个目录下。
    - `\;` 表示 `-exec` 选项的结束。注意，命令行末尾的分号（`;`）是必需的，因为它是用来分隔多个 `-exec` 选项或结束一个完整的命令。
4. ****：
    
    - 这个反斜杠是用来转义分号（`;`），因为分号在shell脚本中是一个特殊字符，用于分隔命令。所以，通过使用反斜杠进行转义，我们可以告诉shell将分号视为普通字符，而不是命令分隔符。

default path is the current directory; default expression is -print 
默认路径是当前目录；默认表达式是-print
==expression== may consist of: operators, options, tests, and actions:  
表达式可以由运算符、选项、测试和操作组成


  
