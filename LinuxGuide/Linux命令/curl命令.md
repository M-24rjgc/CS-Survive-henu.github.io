`curl` 是一个在命令行下工作的工具，利用它可以构造 HTTP 请求报文、发送请求并获取 HTTP 响应。换句话说，`curl` 是一个强大的网络工具，支持多种协议，包括 HTTP、HTTPS、FTP、Gopher、TELNET、DICT、LDAP、LDAPS、FILE 等。`curl` 常被用于调试以及与服务器或 API 进行交互。

### 基本用法

最基本的用法是直接指定一个 URL，然后 `curl` 会向该 URL 发起 GET 请求，并将响应的内容显示在标准输出（通常是终端）：

```bash
bash复制代码$ curl https://www.example.com
```

### 常用选项

- `-A/--user-agent <string>`：设置用户代理发送给服务器。
- `-b/--cookie <name=string/file>`：cookie 字符串或文件读取位置。
- `-c/--cookie-jar <file>`：操作结束后把 cookie 写入到这个文件中。
- `-D/--dump-header <file>`：把 header 信息写入到该文件中。
- `-e/--referer`：来源网址。
- `-f/--fail`：连接失败时不显示 HTTP 错误。
- `-o/--output`：把输出写到该文件中。
- `-O/--remote-name`：把输出写到该文件中，保留远程文件的文件名。
- `-r/--range <range>`：检索来自 HTTP/1.1 或 FTP 服务器字节范围。
- `-s/--silent`：静音模式，不显示任何东西。

### 发送 POST 请求

`curl` 也可以用来发送 POST 请求。例如：

```bash
bash复制代码$ curl -d 'login=emma&password=123' -X POST https://www.example.com/login
```

或者使用 `--data-urlencode` 来对参数进行 URL 编码：

```bash
bash复制代码$ curl --data-urlencode 'comment=hello world' https://www.example.com/login
```

这些只是 `curl` 的基本用法和选项。由于 `curl` 的功能非常强大，它还有许多其他的选项和用法，可以通过 `man curl` 或 `curl --help` 来查看完整的帮助文档和更多详细信息。