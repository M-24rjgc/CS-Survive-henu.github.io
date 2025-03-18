## 下载安装mkosi

下载和安装最新版的mkosi
```bash
git clone https://github.com/systemd/mkosi
```
把mkosi扔进环境变量
```bash
nano ~/.bashrc
# 添加以下内容到文件末尾
export PATH="/home/ada/mkosi/bin:$PATH"
```
使配置生效
```bash
source ~/.bashrc
```
验证是否成功
```bash
# 直接运行 mkosi 
mkosi --version
```

## mkosi

Linux发行版 = Base Files(Base Rootfs) + Essential Packages + Package Manager：
- Debian/Ubuntu = `debootstrap`(`base-files` + `base-passwd`) + `"Essential: yes" Packages` + `apt`
- Fedora/CentOS/RHEL = `yum|dnf --installroot`(`setup` + `basesystem` + `filesystem`) + `@core Package Group` + `yum|dnf`
- Arch = `pacstrap`(`base`) + `base Meta Package` + `pacman`
- Gentoo = `stage 3 Image` + `@system Set` + `emerge`

`mkosi`是建立在`dnf --installroot`、`debootstrap`、`pacstrap`等工具之上的，快速构建客制化的系统镜像并进行测试的工具。

“镜像”在这里是一个**通用概念**，这意味着MKOSI可以生成以下类型的“镜像”：
- 使用GPT分区表的磁盘镜像，可以克隆到磁盘中。
- CPIO归档，用于作为Initrd使用。
- USI（Unified System Image，即将完整的操作系统打包进UKI的镜像）
- Sysext、Confext、Portable Service Image镜像
- 用于容器的目录树镜像


### **`mkosi` 配置文件优先级解析**
`mkosi` 的配置文件遵循 **层级覆盖机制**，优先级从高到低如下：
1. **命令行选项**  
    直接通过命令行传递的参数优先级最高，例如 `mkosi -d fedora build` 中的 `-d fedora`。
2. **本地配置文件**
    - **`mkosi.local.conf`**：位于当前目录，用于覆盖全局配置，**不推荐共享**（如包含敏感路径或密钥）。
    - **`mkosi.local/` 目录**：存放本地覆盖的脚本或配置文件（如 `postinst` 钩子）。
3. **指定目录的配置文件**
    - **`-C|--directory=` 指定的目录**（默认当前目录）下的：
        - **`mkosi.conf`**：主配置文件，定义镜像类型、包管理、分区等。
        - **`mkosi.conf.d/`**：存放分片配置（按文件名顺序加载）。
4. **Profile 配置**
    - **`mkosi.profiles/<profile>/`**：用户定义的配置集，通过 `--profile=<profile>` 激活。  
        示例：为不同环境（开发、生产）创建独立的 Profile。
5. **子镜像配置**
    - **`mkosi.images/<subimage>/`**：定义多镜像构建中的子镜像配置，通过 `--image=<subimage>` 指定。


### **子命令详解**

#### **1. `mkosi summary`**
- **功能**：汇总当前配置，显示构建时将执行的操作（镜像类型、包列表、分区方案等）。
- **用途**：验证配置是否按预期合并，排查优先级冲突。
- **示例**：
    ```bash
    mkosi -d ubuntu summary
    ```
#### **2. `mkosi build`**
- **功能**：根据配置构建镜像。
- **参数传递**：
    - `--` 后的参数传递给 `mkosi.build` 脚本（自定义构建逻辑）。
    - **示例**：
 ```bash
 mkosi build -- --custom-arg=value
#  **`mkosi build`**：调用 `mkosi` 的 `build` 子命令，根据配置构建镜像。
#  **`--`**：分隔符，表示后续参数 **不再由 `mkosi` 解析**，而是传递给 `mkosi` 调用的底层工具或脚本。
#  **`--custom-arg=value`**：自定义参数，传递给 `mkosi.build` 脚本（或其他工具）。
```

#### **3. `mkosi sysupdate`**

- **功能**：调用 `systemd-sysupdate` 更新镜像。

    其中，`--transfer-source=`设为输出目录（默认为`mkosi.output/`），`--definition=`设为`SysupdateDirectory=`的值（默认为`mkosi.sysupdate/`）。
    - 要求：MKOSI使用的Sysupdate配置中，必须设置`PathRelativeTo=explicit`和`Path=/`才能正常使用`sysupdate`子命令进行更新，这会使得配置中的`Path=`使用`mkosi.output/`（或`OutputDirectory=`指定的目录）作为根。
    - （[v27以后不再需要](https://github.com/systemd/mkosi/pull/3515)）这同时也意味着，`SplitArtifacts=partitions`必须启用以对分区进行更新，而且更新内容（分区镜像文件、EFI程序、Initrd）文件名必须与Sysupdate配置中的`MatchPattern=`匹配。
	- `--`之后的命令行参数会被传递为`systemd-sysupdate`的额外参数。 
---

#### **4. `mkosi shell`**

- **功能**：构建镜像后，通过 `systemd-nspawn` 进入镜像的交互式 Shell。
- **限制**：仅支持未压缩的镜像（`QCow2=no` 且未启用压缩）。
- **参数传递**：
    - `--` 后的参数作为命令在镜像内执行。
补充：什么是`systemd-nspawn`：
`systemd-nspawn` 是 systemd 项目提供的一个 **轻量级容器管理工具**，用于创建和管理基于 Linux 命名空间（namespace）和控制组（cgroup）的容器。
`systemd-nspawn` 仅能直接挂载 **raw 格式**的磁盘镜像或 **目录树**。
- **Raw 镜像**：未经压缩或封装，按字节直接映射到存储设备（如 `.img` 文件）。
- **目录树**：直接使用宿主机的目录作为容器根文件系统。
- QCow2 是 QEMU 的虚拟磁盘格式，支持动态分配、快照等特性，但 **需要 QEMU 工具链解析**。
- `systemd-nspawn` 不集成 QCow2 解析能力，无法直接挂载此类镜像。

- **示例**：
    
    ```bash
    mkosi shell -- ls /  # 直接执行命令而非进入 Shell
    ```
    

---

#### **5. `mkosi boot`**

- **功能**：以容器形式启动镜像（基于 `systemd-nspawn`）。
- **限制**：同 `shell` 子命令。
- **参数传递**：
    - `--` 后的参数作为容器启动时的命令行参数。
- **示例**：
    
    
    ```bash
    mkosi boot -- --bind=/host/path:/container/path
    ```
- **`mkosi boot`**：调用 `mkosi` 的 `boot` 子命令，将构建好的镜像以容器形式启动（基于 `systemd-nspawn`）。
- **`--`**：分隔符，表示后续参数由底层工具 `systemd-nspawn` 解析，而非 `mkosi` 自身。
- **`--bind=/host/path:/container/path`**：传递给 `systemd-nspawn` 的参数，用于将宿主机的目录挂载到容器内部

---

#### **6. `mkosi vm`**

- **功能**：以虚拟机形式启动镜像（使用 `qemu` 或 `systemd-vmspawn`）。
- **特性**：
    - 目录树镜像通过 `virtiofsd` 共享。
- **参数传递**：
    - `--` 后的参数传递给虚拟机管理程序（如 `qemu`）。
- **示例**：
    
    ```bash
    mkosi vm -- -m 4G  # 分配 4GB 内存
    ```
    `systemd-vmspawn` 是 systemd 项目提供的 **轻量级虚拟机启动工具**，基于 Linux 命名空间和容器技术，快速启动一个由 `systemd-nspawn` 管理的虚拟机环境。

- **本质**：  
    并非传统虚拟机，而是通过结合容器命名空间和 KVM 实现的轻量级虚拟化（类似 “容器+虚拟机” 混合模式）。

---

#### **7. `mkosi serve`**

- **功能**：启动 HTTP 服务器，暴露构建目录（默认端口 `8081`）。
- **用途**：方便远程访问或测试镜像文件。
- **示例**：
    
    ```bash
    mkosi serve --port 9000  # 修改监听端口
    ```
    

---

#### **8. `mkosi burn`**

- **功能**：将镜像烧录到物理块设备（如 USB 或 SD 卡）。
- **操作步骤**：
    1. 构建镜像。
    2. 扩展镜像至目标设备大小。
    3. 写入设备（**谨慎操作，避免数据丢失**）。
- **示例**：
    
    
    ```bash
    mkosi burn /dev/sdx  # 目标设备路径
    ```
    

---

#### **9. `mkosi genkey`**

- **功能**：生成安全启动密钥（用于 UEFI Secure Boot）。
- **生成文件**：
    - `mkosi.key`（私钥）、`mkosi.crt`（证书）、`mkosi.cer`（公钥）。
- **示例**：
    
    ```bash
    mkosi genkey --passphrase  # 加密私钥
    ```
    

---

#### **10. `mkosi ssh`**

- **功能**：通过 SSH 连接到运行中的镜像（需配置 `Ssh=yes`）。
- **参数传递**：
    - `--` 后的参数传递给 `ssh` 客户端。
- **示例**：
    
    ```bash
    mkosi ssh -- -p 2222  # 指定 SSH 端口
    ```
    

---

#### **11. `mkosi journalctl` 与 `mkosi coredumpctl`**

- **功能**：
    - `journalctl`：查看镜像内的系统日志。
    - `coredumpctl`：管理镜像内的核心转储文件。
- **参数传递**：
    - `--` 后的参数传递给底层命令。
- **示例**：
    
    ```bash
    mkosi journalctl -- -u nginx  # 查看 Nginx 服务日志
    ```
    

---

#### **12. `mkosi sandbox`**

- **功能**：在构建沙箱中执行命令（隔离环境）。
- **用途**：调试构建脚本或测试依赖项。
- **示例**：
    
    bash 收起
    
    ```bash
    mkosi sandbox -- ls /  # 在沙箱中执行命令
    ```
    

---

#### **13. `mkosi clean`**

- **功能**：删除构建产物（镜像、缓存等）。
- **选项**：
    - `-f|--force`：强制清理，无需确认。
- **示例**：
    
    ```bash
    mkosi clean --all  # 清理所有缓存和镜像
    ```
    

---

#### **14. `mkosi bump`**

- **功能**：更新 `mkosi.version` 文件中的版本号（用于镜像命名）。
- **示例**：
    
    ```bash
    mkosi bump --major  # 主版本号递增
    ```

命令行选项
这里提到的命令行选项是和构建配置完全无关的：
#### **1. `-f|--force`：强制重新构建镜像**

- **功能**：无论当前构建状态如何，强制从头开始重新构建镜像（**跳过缓存和增量构建**）。
- **用途**：确保构建环境绝对干净，避免旧文件残留导致问题。
- **示例**：
    
    ```bash
    mkosi -f build  # 强制重新构建镜像
    ```
    

---

#### **2. `-R|--run-build-scripts`：仅执行构建脚本**

- **功能**：  
    仅运行 `mkosi.build` 脚本，**跳过其他构建步骤**（如安装包、生成文件系统等）。  
    行为类似 `Format=none`（不生成最终镜像）。
- **用途**：快速测试构建脚本的修改，无需等待完整构建流程。
- **示例**：
    
    ```bash
    mkosi -R build  # 仅执行 mkosi.build 脚本
    ```
    

---

#### **3. `-B|--auto-bump`：自动刷新版本号**

- **功能**：在操作完成后，自动递增 `mkosi.version` 文件中的版本号（用于镜像命名）。
- **规则**：
    - 若 `mkosi.version` 不存在，创建并初始化为 `1`.
    - 若存在，版本号递增（如 `1` → `2`）。
- **示例**：
    
    ```bash
    mkosi -B build  # 构建后版本号自动递增
    ```
    

---

#### **4. `-C|--directory=`：指定工作目录**

- **功能**：指定 `mkosi` 的工作目录，用于查找配置文件和存储输出文件（默认：当前目录）。
- **规则**：
    - 配置文件路径变为 `<directory>/mkosi.conf`。
    - 输出目录变为 `<directory>/mkosi.output`。
- **示例**：
    ```bash
    mkosi -C ~/projects/myos build  # 在 ~/projects/myos 目录下构建
    ```
    

---

#### **5. `--debug`：启用 Debug 日志**

- **功能**：输出 `Debug` 级别的详细日志，显示每一步操作的详细信息。
- **用途**：排查构建流程中的隐蔽错误。
- **示例**：
    
    ```bash
    mkosi --debug build  # 显示详细构建日志
    ```
    

---

#### **6. `--debug-shell`：失败时启动调试 Shell**

- **功能**：当构建失败时，在 `/work/src` 目录下启动交互式 Shell，保留临时工作区。
- **用途**：检查失败时的文件状态，手动执行命令复现问题。
- **示例**：
    
    ```bash
    mkosi --debug-shell build  # 失败后进入 Shell
    ```
    

---

#### **7. `--debug-workspace`：保留失败时的工作区**

- **功能**：构建失败时，不删除临时工作目录（默认路径为 `mkosi.output/temp`）。
- **用途**：分析中间文件（如未安装的包、部分生成的镜像）。
- **示例**：

    
    ```bash
    mkosi --debug-workspace build  # 失败后保留临时目录
    ```
    

---

#### **8. `--debug-sandbox`：使用 `strace` 跟踪沙盒**

- **功能**：用 `strace` 工具运行 `mkosi-sandbox`，记录所有系统调用（用于调试沙盒权限问题）。
- **依赖**：需安装 `strace`。
- **示例**：
    
    bash 收起
    
    ```bash
    mkosi --debug-sandbox build  # 生成 strace 日志到终端
    ```

## 构建配置

构建配置文件符合`.ini`格式，每一行都是`Key=Value`的形式，每一个配置项都有等价的命令行选项，转换方式是`SomeSetting`到`some-setting`。路径配置在使用相对路径时，取相对于该配置文件本身所在目录的路径。

配置中存在以下可用的占位符：

|占位符|对应配置项|描述|示例场景|
|---|---|---|---|
|`%d`|`Distribution=`|操作系统发行版名称（如 `ubuntu`）|生成镜像名称时包含发行版信息|
|`%r`|`Release=`|发行版版本号（如 `22.04`）|区分不同版本的构建环境|
|`%a`|`Architecture=`|目标架构（如 `x86_64`、`aarch64`）|跨平台构建时动态适配路径|
|`%t`|`Format=`|镜像格式（如 `raw`、`qcow2`）|输出文件名包含格式信息|
|`%o`|`Output=`|输出文件名（不含路径）|生成唯一文件名避免覆盖|
|`%O`|`OutputDirectory=`|输出目录的完整路径|动态指定构建产物存储位置|
|`%i`|`ImageId=`|镜像的唯一标识符（自定义字符串）|标识不同用途的镜像（如 `web-server`）|
|`%v`|`ImageVersion=`|镜像版本号（如 `1.0.0`）|版本化管理镜像|
|`%p`|`Profiles=`|启用的配置文件组合（如 `dev,minimal`）|根据环境组合配置参数|
 路径相关占位符



|占位符|描述|示例场景|
|---|---|---|
|`%C`|**配置文件所在目录**的绝对路径|引用与配置文件同目录的资源文件|
|`%P`|**工作目录**的绝对路径（`-C` 指定或默认）|构建过程中动态定位临时文件|
|`%D`|**mkosi 执行目录**的绝对路径|引用与 `mkosi` 工具相关的资源|
|`%I`|**当前镜像的完整名称**（含格式后缀）|生成镜像的最终输出路径|
具体的构建配置有：

### `[Match]`段与`[TriggerMatch]`段
匹配构建时包含当前配置文件的特定条件。每个配置项除了使用`=`连接键值对外，还可以使用`=|`连接键值对，多个使用`=`连接键值对的配置项之间是逻辑与关系，必须全部满足；多个使用`=|`连接键值对的配置项之间是逻辑或关系，满足一个即可。

可用配置项有：
- `Profiles=`：使用的Profile。
- `Distribution=`：构建的发行版。
- `Release=`：构建的发行版版本。
- `Architecture=`：构建的架构。可用的值有`alpha`、`arc`、`arm`、`arm64`、`ia64`、`loongarch64`、`mips64-le`、`mips-le`、`parisc`、`ppc`、`ppc64`、`ppc64-le`、`riscv32`、`riscv64`、`s390`、`s390x`、`tilegx`、`x86`、`x86-64`。
- `HostArchitecture=`：主机的架构。
- `Image=`：构建的镜像名。子镜像名是它在`mkosi.images/`下的目录名，主镜像名总是`main`。
- `ImageId=`：构建的镜像ID。
- `ImageVersion=`：构建的镜像版本。
- `Bootable=`：构建的镜像是否可引导。
- `Format=`：构建的镜像格式。
- `ToolsTreeDistribution=`：使用的Tools Tree发行版。
- `PathExists=`：主机上存在指定目录。
- `SystemdVersion=`：主机上的systemd版本。

`[Match]`段之间是纯粹的AND关系，也就是说，不同的`[Match]`段必须全部满足。而`[TriggerMatch]`段之间是OR关系，也就是说，不同的`[TriggerMatch]`段中，只要有一个`[TriggerMatch]`段满足即可。

### （v20以上版本）`[Include]`段
- `Include=`：导入指定的额外配置文件。如果值为`mkosi-initrd`，那么会使用`mkosi-initrd`的配置生成Initrd。
    - 特殊值`mkosi-initrd`表示`mkosi-initrd`的配置。
		- 这是推荐的行为，因为MKOSI开发组期望构建出的镜像使用与本地环境无关的Initrd。构建过程中会使用镜像内的安装的内核和固件（在安装时均会被MKOSI移动到`/usr/lib/modules/`目录下）进行打包。
    - 特殊值`mkosi-tools`表示ToolsTree的配置。
    - 特殊值`mkosi-vm`表示运行虚拟机时的默认配置。

### （v20以上版本）`[Config]`段
额外配置。
- `Profiles=`：使用指定的Profile，Profile是`mkosi.profiles/`目录下保存的一个配置文件或子工作目录，它支持的内容和MKOSI的主工作目录完全一致（除了不能有`mkosi.profiles/`目录），会覆盖主工作目录的对应部分。
	- **Profile通常是让用户通过`--profile=`命令行选项进行自选的**。它可以用于匹配，因此适合保存相同镜像的不同口味。
	- 子镜像中也可以创建Profile，这些Profile只会作用于当前的子镜像（如果没有构建当前的子镜像则无影响），但是子镜像中不能设置`Profiles=`，而且子镜像的Profile必须是工作目录，不可以是配置文件。
- `ConfigureScript=`：在读取配置文件后（`ToolsTree`构建之前），在宿主环境中立刻执行的脚本，它会通过标准输入接收JSON格式的配置文件内容，应当通过标准输出输出JSON格式的配置文件内容，用于**动态创建或修改构建配置**。默认为`mkosi.configure`。
- `MinumumVersion=`：要求的最小MKOSI版本号。
- `PassEnvironment=`：传递的环境变量，空格分隔。
- `Dependencies=`：子镜像的依赖关系，子镜像是`mkosi.images/`目录下保存的一个子工作目录，它支持的配置项和MKOSI的主工作目录相比会少一些。
	- 该配置项对应的命令行选项是`--dependency`，不是`--dependencies`。
	- 如果在主（Main）镜像中设置，那么作用是选择要构建的子镜像。如果没有`Dependencies=`，那么所有子镜像都会在主镜像构建之前自动构建，即相当于`Dependencies=*`，如果有`Dependencies=`，那么只构建指定的子镜像。
	- 子镜像通过其目录确定镜像文件名，不会受到`ImageId=`的影响。
	- 要使用子镜像的产物，在主镜像中使用`%O`占位符。
	- 子镜像不接受的配置项有：
	    - `Architecture=`
	    - `BuildDirectory=`
	    - `BuildSources=`
	    - `BuildSourcesEphemeral=`
	    - `CacheDirectory=`
	    - `CacheOnly=`
	    - `Distribution=`
	    - `ExtraSearchPaths=`
	    - `Incremental=`
	    - `LocalMirror=`
	    - `Mirror=`
	    - `OutputDirectory=`
	    - `OutputMode=`
	    - `PackageCacheDirectory=`
	    - `PackageDirectories=`
	    - `Profiles=`
	    - `ProxyClientCertificate=`
	    - `ProxyClientKey=`
	    - `ProxyExclude=`
	    - `ProxyPeerCertificate=`
	    - `ProxyUrl=`
	    - `Release=`
	    - `RepartOffline=`
	    - `Repositories=`
	    - `RepositoryKeyCheck=`
	    - `SandboxTrees=`
	    - `SourceDateEpoch=`
	    - `ToolsTree=`
	    - `ToolsTreeCertificates=`
	    - `UseSubvolumes=`
	    - `VerityCertificate=`
	    - `VerityKey=`
	    - `VolatilePackageDirectories=`
	    - `WithNetwork=`
	    - `WithTests`
	    - `WorkspaceDirectory=`


### `[Distribution]`段
发行版配置。
- `Distribution=`：使用的发行版，目前支持`fedora,debian,ubuntu,arch,opensuse,mageia,centos,centos_epel,openmandriva,rocky,rocky_epel,alma,alma_epel,gentoo,custom`。默认使用主机的发行版。
	- 当`Distribution=custom`时，无法自动构建Rootfs，需要自行提供。
- `Release=`：使用的版本。默认使用主机的版本。
- `Architecture=`：使用的架构。默认使用主机的架构。
- `Mirror=`：使用的软件源。
    - 在使用EPEL时，如果要为EPEL使用其他软件源，使用`$EPEL_MIRROR`环境变量。
    - Debian的Debug和Security源无法直接切换软件源，考虑使用`mkosi.pkgmngr`，或是构建无Debug和Security仓库的`sid|unstable`版本。
    - 该选项的值会被写入镜像，作为镜像的默认软件源。
- `LocalMirror=`：在构建时**只使用**这些软件源，会屏蔽掉内置的默认软件源并覆盖`Mirror=`的值，但是不会写入镜像。
- `RepositoryKeyCheck=`：检查镜像源密钥。
- `RepositoryKeyFetch=`：在安装时自动尝试获取软件源密钥，默认启用，如果禁用，将从宿主机传递软件源密钥，这需要安装对应的`*-keyring`软件包。
- `Repositories=`：启用的Yum源名（例如`epel`），或是Apt源的分区（例如`main`）。使用逗号分隔。

### `[Output]`段
输出方式。
- `Format=`：导出格式，`mkosi`支持非常多种镜像，包括但不仅限于：
	- `disk`：GPT+UEFI磁盘镜像。使用`systemd-repart`生成。
	- `directory`：纯目录形式的容器根文件系统。
	- `tar`：Tar包。
	- `cpio`：CPIO包。
	- `uki`：UKI镜像。
	- `addon`：UKI扩展。
	- `esp`：类似于`uki`，但是转换为一个包含单个ESP的GPT分区表的磁盘镜像。
	- `oci`：OCI容器镜像。
	- `sysext|confext|portable`：系统扩展镜像。它们的分区格式配置位于[Repart Definitions](https://github.com/systemd/mkosi/tree/main/mkosi/resources/repart/definitions)。
	- `none`：当前配置用于分组，或是执行纯构建操作。如果没有`mkosi.build`脚本的话，会跳过任何构建过程的执行（[包括`mkosi.prepare`脚本](https://github.com/systemd/mkosi/blob/main/mkosi/__init__.py#5201)，在没有产物，也不进行构建的情况下，`mkosi.prepare`脚本所做的任何操作都是没有意义的）。
- `ManifestFormat=`：生成镜像大纲（保存安装的所有软件包列表）的格式，可选`json`或`changelog`，默认不生成。
- `Output=`：输出文件/目录的前缀，默认为`image`。
	- `ImageID + ImageVersion`会被用作默认的输出文件名前缀（`Output=`）。
- `OutputExtension=`：输出文件的后缀，会覆盖默认后缀。
- `OutputDirectory=`：构建产品的保存目录，默认为工作目录下的`image`，也可以手动创建`mkosi.output/`以默认使用该目录。
- `CompressOutput=`：输出镜像的压缩方式，请注意，这会导致`shell`、`boot`、`vm`命令在该镜像上不可用。仅可用于`tar`、`cpio`、`uki`、`esp`和`oci`镜像。可选值有布尔值和`xz`、`zstd`等压缩算法，以及`none`。默认使用`zstd`。
    - `CompressLevel=`：压缩等级。
- `SplitArtifacts=`：分开导出的产品列表，使用逗号分隔，可选值有`uki`、`kernel`、`initrd`、`partitions`、`tar`。
	- 默认值`no`等价于`uki,kernel,initrd`。
	- `uki`会导出UKI。
	- `kernel`和`initrd`会导出组成UKI的内核和Initrd。
	- `partitions`在使用磁盘镜像时，会告诉`systemd-repart`针对每个分区分别进行导出。默认情况下，导出的分区文件会以`输出文件名前缀.分区名`命名。
	- `tar`会额外导出一份构建时产生的根文件系统的Tar包。
- `ImageVersion=`：镜像的版本号。
    - 你也可以使用`mkosi.version`文件指定版本号，此文件还可以是一个可执行的Shell脚本，使用其输出作为版本号。
    - `ImageID + ImageVersion`会被用作默认的输出文件名前缀（`Output=`）。
- `ImageID=`：镜像ID，会被写入镜像的`os-release`文件中。
	- `ImageID + ImageVersion`会被用作默认的输出文件名前缀（`Output=`）。
- `RepartDirectories=`：`systemd-repart`的分区定义配置文件目录，默认为工作目录下的`mkosi.repart/`。
    - 注意，MKOSI的分区配置文件中的`CopyFiles=`的源路径会使用镜像中的根文件系统。
- `SectorSize=`：`systemd-repart`的块大小。
- `Seed=`：`systemd-repart`使用的UUID，也可以使用`mkosi.seed`文件保存，默认值为`random`。
- `Overlay=`：和`BaseTrees=`一起使用，是否仅仅保留相对于Base Tree发生改变的内容，用于构建系统扩展镜像。
    - 在构建系统扩展镜像时，可以使用该选项结合`BaseTree=`指定的目录以获取增量部分，即扩展镜像的部分。
- `CleanScripts=`：用于构建的最后阶段进行清理的脚本，默认为`mkosi.clean`。

### `[Build]`段
- `ToolsTree=`：在指定目录下搜索构建工具组，也可以使用`mkosi.tools/`目录保存，这有助于使用其他版本的构建工具组。
    - 如果值为`default`，那么会从指定的发行版的软件源中自动获取Tools Tree。在目标发行版的systemd版本低于构建所需的最低要求时，会自动启用。
    - 在当前发行版低于构建所需的最低systemd版本时，该选项必须启用。
    - 在宿主机没有安装构建时必需的工具（如`reprepo`）时，启用该选项可以避免在宿主机安装软件包。
    - `ToolsTreeDistribution=`：用于自动获取`ToolsTree=`的目标发行版。
    - `ToolsTreeRelease=`：用于自动获取`ToolsTree=`的目标发行版版本。
    - `ToolsTreeMirror=`：用于自动获取`ToolsTree=`的目标发行版软件源。
    - `ToolsTreeRepositories=`：和`Repositories=`一样，但是用于构建`ToolsTree=`。
    - `ToolsTreeSandboxTrees=`：和`SandboxTrees=`一样，但是用于构建`ToolsTree=`。
    - `ToolsTreePrepareScripts=`：和`PrepareScripts=`一样，但是用于构建`ToolsTree=`。默认为`mkosi.tools.prepare`。
    - `ToolsTreeProfiles=`：在`ToolsTree=`中启用的Profile，默认启用所有Profile，逗号分隔，可选值有：
        - `misc`：用于脚本的各种杂项工具。
        - `package-manager`：包管理器及其附属的各种工具。
        - `runtime`：用于`boot`镜像时所需的各种工具。
    - `ToolsTreePackages=`：在`ToolsTree=`中包含的额外软件包。
    - `ToolsTreeCertificates=`：是否使用Tools Tree中的证书，这包括`/etc/pki`、`/etc/ssl`、`/etc/ca-certificates`和`/var/lib/ca-certificates`，如果禁用，使用主机上的证书。
- `Incremental=`：渐进构建，可选值为布尔值或`strict`。在执行`mkosi.build`脚本之前提供镜像缓存，这可以显著提高构建速度。如果为`strict`，那么如果缓存镜像不存在则会报错退出。
- `CacheOnly=`：纯缓存模式，可选值有`auto`、`metadata`、`always`或`never`，如果为`always`，那么包管理器不会联网，只使用本地缓存；如果为`metadata`，那么包管理器不会联网更新元数据；如果为`auto`，那么仅在不存在缓存镜像时更新元数据。
- `SandboxTrees=`：接受逗号分隔的，冒号绝对路径对。前者是主机上的路径，后者是MKOSI构建沙箱内的路径，表示在执行构建之前拷贝到构建沙箱的文件。也可以使用`mkosi.sandbox/`目录进行保存。
- `WorkspaceDirectory=`：临时文件的保存目录，默认为`$XDG_CACHE_HOME`或`$HOME/.cache`或`/var/tmp`。
- `CacheDirectory=`：构建时软件包管理器缓存的保存目录，默认使用工作目录下的`mkosi.cache/`。
- `PackageCacheDirectory=`：软件包管理器的缓存目录。
- `BuildDirectory=`：用于保存Out-of-Tree构建中间产物的目录，这使得构建的中间产物可以在多次构建时共享，在构建脚本中可以通过`$BUILDDIR`访问。默认为`mkosi.builddir/`。
- `UseSubvolumes=`：是否使用Btrfs子卷，可选值有布尔值或`auto`。
- `RepartOffline=`：是否在不使用回环设备的情况下构建磁盘镜像。默认情况下为`yes`。
	- 如果禁用，那么`systemd-repart`必须具有特权，因此构建只能通过`root`用户执行。
	- 只有两种情况下必须禁用：
		1. 使用了Btrfs，而且在`mkosi.repart/`配置中设置了`Subvolumes=`。因为Btrfs子卷必须通过回环设备创建。
		2. 另一种是以XFS为根文件系统，而且启用了SELinux。因为必须通过回环设备才能确保SELinux扩展属性被写入XFS文件系统。
- `History=`：是否保存历史，历史会被保存在`.mkosi-private`目录下。
- `ExtraSearchPaths=`：用于搜索工具的额外目录，会在构建时被添加到`$PATH`中。
- `ProxyUrl=`：使用的代理地址。
    - `ProxyExclude=`：不使用代理的主机名。
    - `ProxyPeerCertificate=`：代理Peer的证书。
    - `ProxyClientCertificate=`：代理客户端的证书。
    - `ProxyCientKey=`：代理客户端的Key。

### `[Content]`段
镜像配置：
- `Packages=`：包含的包，使用逗号或是换行符分隔。会使用该发行版对应的包管理器进行安装。
- `VolatilePackages=`：包含的包，但是这些包不受`Incremental=`影响，不会被缓存。
- `BuildPackages=`：在构建时，使用Overlay的方式安装软件包。这样的包不会在镜像中保留，应当用于`mkosi.build`脚本。
- `PackageDirectories=`：读取指定目录下的额外软件包，并允许在构建时通过`Packages=`进行安装。也可以使用`mkosi.packages/`目录保存。
- `VolatilePackageDirectories=`：读取指定目录下的额外软件包，并允许在构建时通过`Packages=`进行安装，这些包不受`Incremental=`影响，不会被缓存。
- `WithRecommends=`：是否安装弱依赖，仅适用于`apt`、`dnf`和`zypper`。默认禁用。
- `WithDocs=`：是否在镜像内保留文档。默认启用。
- `MakeInitrd=`：是否在镜像内创建`/init`和`/etc/initrd-release`文件。该配置项通常在MKOSI-INITRD内部使用。
- `BaseTrees=`：接受逗号分隔的，冒号绝对路径对。前者是主机上的路径，后者是镜像内的路径，表示在获取发行版基本根文件系统之前，将主机文件/目录拷贝到镜像内。这也是`Overlay=yes`参考的基础文件系统。如果没有指定镜像内的路径，那么默认为`/`。
	- 设置该配置项会导致MKOSI跳过自动构建基本的Base Tree。
	- 注意！如果自行提供Base Tree，那么必须在Base Tree，或者Skeleton Tree，或者`mkosi.prepare`脚本中提供`/usr/lib/os-release`。
- `SkeletonTrees=`：接受逗号分隔的，冒号绝对路径对。前者是主机上的路径，后者是镜像内的路径，表示在已经构建基本根文件系统，开始安装软件包之前，将主机文件/目录拷贝到镜像内。
	- `mkosi.skeleton/`目录下的文件总是会被拷贝到相同的目标位置下。
- `ExtraTrees=`：接受逗号分隔的，冒号绝对路径对。前者是主机上的路径，后者是镜像内的路径，表示在安装软件包之后，将主机文件/目录拷贝到镜像内。
	- `mkosi.extra/`目录下的文件总是会被拷贝到相同的目标位置下。
- `RemovePackages=`：在构建后删除指定的包。
- `RemoveFiles=`：在构建后删除指定的文件，路径使用镜像内的根文件系统。
- `CleanPackageMetadata=`：是否在构建后清理镜像内包管理器的缓存。默认为是。
- `Bootable=`：镜像是否可引导（是否安装引导程序），可选值除了布尔值还有`auto`。默认为`auto`，即尽可能设置。如果设为`yes`，那么在`Bootloader=`设置的Bootloader软件包不存在时，构建会失败。
	- 镜像内必须安装对应架构的内核和引导程序。
	- `Bootloader=`：使用的引导程序，可选`none`、`uki`、`systemd-boot`、`grub`、`systemd-boot-signed`、`grub-signed`、`uki-signed`。默认为`systemd-boot`。
		- 如果`Bootable=no`，那么该配置项无意义。
		- 如果使用`none`，那么和`Bootable=no`的效果一致。
		- 如果使用`grub`，那么镜像中必须安装对应架构的`grub`软件包，确保存在`/usr/lib/grub`或`/usr/share/grub2`目录。MKOSI会将GRUB的EFI程序安装到构建过程中的`/efi`目录，为GRUB生成配置文件`/efi/grub/grub.cfg`。此外，MKOSI还会生成一个`/efi/EFI/发行版名称/grub.cfg`配置文件，它的内容实际上是加载`/efi/grub/grub.cfg`。
		- 如果使用`systemd-boot`，那么镜像中必须安装对应架构的`systemd-boot`软件包，确保存在`bootctl`程序和`systemd-boot`的EFI程序。MKOSI会将`systemd-boot`的EFI程序安装到构建过程中的`/efi`目录，在不使用UKI的情况下，MKOSI会为`systemd-boot`生成标准的Type1引导项文件`/efi/loader/entries/Token-内核版本.conf`。
		- 如果使用`uki`，那么不会在ESP中安装任何其他引导程序，而是直接将UKI安装到构建过程中的`/efi`目录（准确地说，是`/efi/EFI/BOOT/BOOT*.EFI`如果启用了Shim，那么是`/efi/EFI/BOOT/grub*.EFI`），作为EFI Boot Manager的引导项使用。
		- `*-signed`表示使用对应的Bootloader的已签名版本。MKOSI会认为对应的Bootloader已经签名，在`SecureBoot=yes`的情况下，不会再对Bootloader进行签名。
	- `BiosBootloader=`：是否安装BIOS引导，可选`none`或`grub`，如果启用，那么需要创建大小为1MB，类型为`21686148-6449-6e6f-744e-656564454649`的`biosboot`分区。默认为`none`。
		- 如果`Bootable=no`或`Format=`不是`disk`，那么该配置项无意义。
		- 如果使用`grub`，那么镜像中必须安装对应架构的`grub`软件包。
	- `ShimBootLoader=`：是否安装Shim，可选`none`、`unsigned`或`signed`。在`SecureBoot=yes`的情况下，如果为`unsigned`，那么MKOSI会安装未签名的Shim，并自行对其进行签名，如果为`signed`，那么MKOSI会安装已签名的Shim。默认为`none`。
		- 如果设为`unsigned`，那么镜像内必须安装`shim-unsigned`软件包。
		- 如果设为`signed`，那么镜像内必须安装`shim-signed`软件包。
		- 在没有启用`SecureBoot=true`的情况下，该选项没有意义。
- `KernelModulesInclude=`：在镜像中包含的内核模块，格式为相对于`/usr/lib/modules/内核版本/kernel`目录的，`re.search()`风格的路径正则表达式，这对于Initrd特别有用。
	- 关键词`default`表示包含MKOSI-INITRD的`mkosi.conf`中的所有默认配置，参见[mkosi.conf](https://github.com/systemd/mkosi/blob/main/mkosi/resources/mkosi-initrd/mkosi.conf)。这也是未设置该配置项的默认值。[MKOSI-INITRD中的配置是systemd开发组在开发ParticleOS时在不同硬件平台上测试得到的](https://github.com/systemd/mkosi/pull/3474)，目前仍在更新，因此可能会有缺失。
	- 关键词`host`表示包含宿主机当前加载的所有模块。
	- `KernelModulesIncludeHost=`：是否在镜像中包含宿主机当前加载的所有模块。这等价于`KernelModulesInitrdInclude=host`。
	- 该配置项仅对没有启用`Overlay=yes`的镜像（也就是说，不是Sysext、Confext和Portable Service的镜像）有意义。
	- 该配置项的优先级高于`KernelModulesExclude=`，且在没有设置`KernelModulesExclude=`的情况下没有意义，因为MKOSI默认情况下总是包含所有的内核模块。
	- 值得参考的通用Initrd模块内容：[Ubuntu Core的选择](https://github.com/canonical/core-initrd/blob/main/modules/main/extra-modules.conf)。
- `KernelModulesExclude=`：在镜像中排除的内核模块，格式为相对于`/usr/lib/modules/内核版本/kernel`目录的，`re.search()`风格的路径正则表达式。
    - 该配置项默认为空。
- `FirmwareInclude=`：在镜像中包含的固件，格式为相对于`/usr/lib/firmware/`目录的，`re.search()`风格的路径正则表达式。即使没有任何内核模块依赖这些固件，MKOSI也会强制将其包含到镜像内。
	- 该配置项的优先级高于`FirmwareExclude=`。
- `FirmwareExclude=`：在镜像中排除的固件，格式为相对于`/usr/lib/firmware/`目录的，`re.search()`风格的路径正则表达式。即使有内核模块依赖这些固件，MKOSI也会强制将其排除掉。
    - 不存在`FirmwareIncludeInitrd=`和`FirmwareExcludeInitrd=`，这是[故意的](https://github.com/systemd/mkosi/pull/3483)，用户应当通过`mkosi.images/`子镜像功能实现更细粒度的Initrd自定义。

Initrd配置：
- `InitrdProfile=`：启用的额外Default Initrd配置，默认不启用。
	- `lvm`：LVM支持。
- `KernelModulesInitrd=`：在构建可引导（`Bootable=true`）的镜像时，MKOSI会先读取MKOSI-INITRD的配置，[构建一个目标发行版的，不包含任何模块的默认Initrd](https://github.com/systemd/mkosi/blob/main/mkosi/__init__.py#L1211)（构建配置中没有包含内核模块包），然后，该配置项用于确定是否需要构建一个额外的，包含特定的当前正在构建的镜像的内核模块的Initrd（即，根据`KernelModulesInitrdInclude=`和`KernelModulesInitrdExclude=`配置项构建的Initrd），并将其合并到默认Initrd中。默认启用。
    - 在启用了UKI（`UnifiedKernelImage=yes`）时，禁用该配置项有助于用户根据自己的需要构建出更通用的UKI镜像，并使用`Format=addon`构建扩展Initrd进行补充。
    - 在用户使用自己提供的Initrd（`Initrds=`）时，也可以考虑禁用该配置项。
    - 在未启用UKI时，该配置项没有意义，因为此时总是会构建默认Initrd和内核模块Initrd，并进行合并。
- `KernelModulesInitrdInclude=`：在Initrd中包含的模块，格式为相对于`/usr/lib/modules/内核版本/kernel`目录的，`re.search()`风格的路径正则表达式。
    - 关键词`default`表示包含MKOSI-INITRD的`mkosi.conf`中的所有`KernelModulesInitrdInclude=`配置，参见[mkosi.conf](https://github.com/systemd/mkosi/blob/main/mkosi/resources/mkosi-initrd/mkosi.conf)。这也是未设置该配置项的默认值。
    - 关键词`host`表示包含宿主机当前加载的所有模块。
	- `KernelModulesInitrdIncludeHost=`：是否在Initrd中包含宿主机当前加载的所有模块。这等价于`KernelModulesInitrdInclude=host`。
	- 该配置项的优先级高于`KernelModulesExclude=`，且在没有设置`KernelModulesExclude=`的情况下没有意义，因为MKOSI默认情况下总是包含所有的内核模块。
- `KernelModulesInitrdExclude=`：在Initrd中排除的模块，格式为相对于`/usr/lib/modules/内核版本/kernel`目录的，`re.search()`风格的路径正则表达式。
	- 因为MKOSI默认会加载`mkosi-initrd`的配置（`KernelModulesInitrdInclude=default`），因此如果希望重设模块，需要先设置`KernelModulesExclude=.*`。
	- 该配置项默认为空。
- `UnifiedKernelImages=`：是否使用UKI而不是独立Initrd。默认为`auto`，即尽可能使用。
	- 如果启用了UKI：如果`systemd-repart`发现了存在哈希值（即，启用了Verity）的根文件系统分区，那么会将其哈希值写入UKI的`roothash=`内核命令行参数中。否则，如果`systemd-repart`发现了存在哈希值（即，启用了Verity）的`/usr/`文件系统分区，那么会将其哈希值写入UKI的`usrhash=`内核命令行参数中。
	- 如果未启用UKI，且使用`systemd-boot`：如果`systemd-repart`发现了存在哈希值（即，启用了Verity）的根文件系统分区，那么会将其哈希值写入BLS引导条目的`roothash=`内核命令行参数中。否则，如果`systemd-repart`发现了存在哈希值（即，启用了Verity）的`/usr/`文件系统分区，那么会将其哈希值写入BLS引导条目的`usrhash=`内核命令行参数中。否则，如果找到了GPT PARTLABEL为`root*`的分区，那么会将其PARTUUID写入BLS引导条目的`root=PARTUUID=`内核命令行参数中。
	- 如果未启用UKI，且使用GRUB：如果`systemd-repart`发现了存在哈希值（即，启用了Verity）的根文件系统分区，那么会将其哈希值写入`grub.cfg`的`roothash=`内核命令行参数中。否则，如果`systemd-repart`发现了存在哈希值（即，启用了Verity）的`/usr/`文件系统分区，那么会将其哈希值写入`grub.cfg`的`usrhash=`内核命令行参数中。否则，如果找到了GPT PARTLABEL为`root*`的分区，那么会将其PARTUUID写入`grub.cfg`的`root=PARTUUID=`内核命令行参数中。否则，如果找到了GPT PARTLABEL为`usr*`的分区，那么会将其PARTUUID写入`grub.cfg`的`mount.usr=PARTUUID=`内核命令行参数中。
    - `UnifiedKernelImageFormat=`：UKI文件命名，默认为`&e-&k`，支持的占位符有：
        - `&&`：`&`本身。
        - `&e`：Token。
        - `&k`：内核版本。
        - `&h`：`roothash=`或`usrhash=`的值。
        - `&c`：引导尝试次数。
    - `UnifiedKernelImageProfiles=`：为构建的UKI添加配置（即`.profile`段），接受逗号分隔的配置文件。也可以保存在`mkosi.uki-profiles/`目录下。配置以`.conf`结尾，只有一个`UKIProfile`段。请注意，每个UKI配置在使用时都会被追加UKI的基础内核命令行参数。可用内容有：
	    - `Profile=`：配置信息，包括`ID`（必须）和`TITLE`。
	    - `Cmdline=`：内核命令行参数。
	    - `SignExpectedPcr=`：是否为该配置进行PCR签名。默认启用。
    - `PeAddons=`：（**已被移除**）构建额外的UKI插件，接收逗号分隔的`ukify`配置文件，额外的PE插件会以`配置文件名.addon.efi`命名，也可以将`ukify`配置文件保存在`mkosi.pe-addons/`目录下。
	    - 该配置项现在已经废弃，为MKOSI-ADDON让位。
- `MicrocodeHost=`：是否在Initrd中仅仅包含主机的CPU微码。默认禁用。
- `InitrdPackages=`：在MKOSI自动构建的默认Initrd中额外安装的软件包。
- `InitrdVolatilePackages=`：在MKOSI自动构建的默认Initrd中额外安装的软件包。但是这些包不受`Incremental=`影响，不会被缓存。
- `Initrds=`：[禁用自动构建的默认Initrd](https://github.com/systemd/mkosi/blob/main/mkosi/__init__.py#L1822)，使用用户提供的指定Initrd，也可以使用`io.mkosi.initrd`目录保存。
	- 如果要在构建时使用其他方式构建Initrd，应该在`mkosi.images/`目录下创建一个子镜像，并将该配置项设为`Initrds=%O/子镜像名称`。
- 额外导出独立的Initrd，该Initrd只包含UKI中的内核模块部分，默认启用。
- `KernelCommandLine=`：封装在UKI或Initrd内的内核命令行参数。
    - 如果检测到使用了Verity的`root`分区或`usr`分区，那么会自动填充`roothash=分区Hash值`或`usrhash=分区Hash值`。
    - 内核命令行参数`root=PARTUUID`和`mount.usr=PARTUUID`会被自动填充类型为`root`或`/usr`的分区的UUID。

镜像预设配置，这些配置会通过`systemd-firstboot`的对应选项传递，还会写入到镜像内的`/usr/lib/credstore`目录下：
- `MachineID=`：设置镜像内的机器ID，默认为`random`，也可以使用`mkosi.machine-id`文件保存。
- `Locale=`：镜像内的语言。
- `Keymap=`：镜像内的Keymap。
- `Hostname=`：设置镜像内的默认主机名。
- `RootShell=`：Root用户的默认Shell。
- `RootPassword=`：设置镜像内Root用户的默认密码。
	- 你也可以使用`mkosi.rootpw`文件指定密码，该文件还可以是一个可以执行的Shell脚本，使用其输出作为密码。
- `Autologin=`：是否设置Root用户在`/dev/pts/0`、`/dev/tty1`和`/dev/hvc0`的自动登录。
- `Ssh=`：是否在镜像内创建SSH套接字以允许通过`mkosi ssh`连接，使用`mkosi genkey`创建密钥。
- `SELinuxRelabel=`：是否在镜像内进行Relabel。

为了实现更多功能，还可以在构建镜像的不同过程中执行各种钩子脚本脚本：
- `SyncScripts=`：在开始构建镜像之前，在宿主环境中执行的脚本，该脚本有网络连接，用于更新需要在镜像中进行构建的各种源代码，注意该脚本的更新操作在沙盒中进行，不会破坏`BuildSourcesEphemeral=`，默认为`mkosi.sync`。
- `PrepareScripts=`：该脚本会首先在镜像中安装软件包后，以`final`位置参数被执行一次（执行的操作会被保留在镜像中），然后在创建构建Overlayfs之后以`build`位置参数再被执行一次（执行的操作不会被保留在镜像中）。该脚本被执行时有网络连接，因此可以用于安装软件包。默认为`mkosi.prepare`。
	- 注意！如果自行提供Base Tree，那么必须在Base Tree，或者Skeleton Tree，或者`mkosi.prepare`脚本中提供`/usr/lib/os-release`。
- `BuildScripts=`：在准备好构建环境后，在s宿主环境或镜像中执行的脚本，该脚本可以具有网络连接，取决于`WithNetwork=`的值。默认为`mkosi.build`。
	- `BuildSources=`：进行构建时拷贝的代码树目录，接受逗号分隔的，冒号绝对路径对。前者是主机上的路径（默认为`.`），后者是沙盒内的路径（默认为同名路径），镜像内的路径总是会自动添加`/work/src`前缀。默认情况下值为`.`，即将当前工作目录完全拷贝到沙盒的`/work/src`。
	- `BuildSourcesEphemeral=`：是否不保留对源码树的更改，如果启用，那么除了`mkosi.sync`以外的所有脚本对`BuildSources=`的修改都不会保留。如果设为`buildcache`，那么`mkosi.build`脚本的修改产生的Overlay会被保留在`BuildDirectory=`中，其他脚本的修改仍然会被抛弃，默认禁用。
- `PostInstallationScripts=`：在配置完Extra Tree后，在宿主环境或镜像中执行的脚本，该脚本可以具有网络连接，取决于`WithNetwork=`的值，默认为`mkosi.postinst`。
- `FinalizeScripts=`：在构建完全完成后的最后阶段，在宿主环境或镜像中执行的脚本，该脚本可以具有网络连接，取决于`WithNetwork=`的值，默认为`mkosi.finalize`。
- `PostOutputScripts=`：在输出产品后，在宿主环境或镜像中执行的脚本，该脚本没有网络连接，默认为`mkosi.postoutput`。
- `Environment=`：给脚本传递的环境变量。
- `EnvironmentFile=`：从文件给脚本传递环境变量。
- `WithTests=`：设为假，则在执行`mkosi.build`脚本时，`$WITH_TESTS`变量为0。
- `WithNetwork=`：在执行`mkosi.build`、`mkosi.postinst`和`mkosi.finalize`脚本时提供网络。


















## mkosi-addon

###  **`mkosi-addon` 是做什么的？**
`mkosi-addon` 是一个简化工具，用于生成**针对当前系统的 UKI（统一内核镜像）附加组件**。这些组件可以让 UKI 支持以下功能：

- **自动解密硬盘**：读取 `/etc/crypttab` 中标记为 `x-initrd.attach` 的加密硬盘配置。
- **自定义内核参数**：将 `/etc/kernel/cmdline` 中定义的内核启动参数嵌入 UKI。
- **包含硬件驱动和固件**：若配置文件启用 `KernelModulesIncludeHost=yes`，会包含当前系统的驱动和固件文件。
### **UKI 插件**

- **是什么**：一个补充 UKI 功能的附加文件（通常为 `cpio` 格式），而不是完整的 Initrd。
- **用途**：在已有 UKI 的基础上，扩展对加密硬盘或特定启动参数的支持。

```
mkosi-addon [选项]
```
可用选项有：
- `--kernel-version=`：使用的内核版本，默认使用`$(uname -r)`。
- `-o|--output=`：输出文件名前缀，默认为`initrd`。
- `-O|--output-dir=`：输出的目录，默认为工作目录。
- `--debug-sandbox`：使用`strace`运行`mkosi-sandbox`。


## mkosi-initrd
**mkosi-initrd：基于 MKOSI 的 Initrd 构建工具**
### **核心功能**

- 利用 MKOSI 的声明式配置能力，自动化构建 Linux 系统的 **Initrd（初始 RAM 磁盘）**。
- 默认集成当前宿主机的内核模块（通过映射 `/usr/lib/modules/<内核版本>`），确保生成的 Initrd 包含兼容的硬件驱动。
- 支持生成两种格式：
    - **`cpio`**：传统 Initrd 格式（压缩的 CPIO 存档）。一种文件打包格式，可以把多个文件压缩成一个文件（类似 ZIP）。`mkosi-initrd` 生成的 CPIO 文件就是 Initrd 的压缩包，里面包含临时系统的所有工具和驱动。
    - **`uki`**：统一内核镜像（Unified Kernel Image），将内核、Initrd 和启动参数打包为单一文件，支持 UEFI 直接启动。传统启动需要分别加载内核和 Initrd，UKI 把它们打包在一起，简化启动流程。
### **为什么需要 `mkosi-initrd`？**
手动创建 Initrd 很麻烦，需要自己打包文件、配置驱动(驱动文件放在 `/usr/lib/modules/<内核版本>` 目录里)。  
**`mkosi-initrd`** 是一个自动化的工具，帮你快速生成 Initrd，省去手工操作的步骤。`mkosi-initrd` 会自动复制当前电脑的驱动到 Initrd 中，这样生成的 Initrd 才能识别你的硬件。

### 使用方法

mkosi本身在构建的时候就包含了initrd，这个功能相当于单独抽出来了。
```bash
mkosi-initrd [选项]
```
可用选项有：
- `-k|--kernel-version=`：使用的内核版本，默认使用`$(uname -r)`。
- `-t|--format=`：输出格式，可选值有`cpio`或`uki`，默认使用`cpio`。
- `-g|--generic`：生成通用Initrd，即[可以在不同的硬件平台上启动当前系统的Initrd](https://github.com/systemd/mkosi/pull/3471)。
- `-o|--output=`：输出文件名前缀，默认为`initrd`。
- `-O|--output-dir=`：输出的目录，默认为工作目录。
- `--profile`：启用的额外Initrd配置，默认不启用。
	- `lvm`：LVM支持。
- `--debug`：Debug输出。
- `--debug-sandbox`：使用`strace`运行`mkosi-sandbox`。

它本质上是一个使用了特殊的默认配置的MKOSI Wrapper脚本（见[mkosi.conf](https://github.com/systemd/mkosi/blob/main/mkosi/resources/mkosi-initrd/mkosi.conf)），在执行时，它会获取当前主机的内核版本（或用户指定的内核版本），并将当前内核的`/usr/lib/modules/版本号`目录映射到镜像中进行构建。

该命令行工具由MKOSI的Pypi包提供，对于发行版来说，它们也可以使用Kernel-install脚本进行集成（参考[setup-mkosi](https://github.com/marketplace/actions/setup-mkosi)）。

（ **什么是 `kernel-install` 脚本？**这是 Linux 发行版在安装新内核时自动调用的脚本，负责将内核文件复制到 `/boot` 目录并更新引导配置。）

## mkosi-sandbox

`mkosi-sandbox` 是一个创建隔离环境（沙盒）的工具，用于安全地运行命令或脚本，避免对宿主机系统造成意外修改。它的核心功能是：

- **文件系统隔离**：通过挂载、绑定、覆盖层（OverlayFS）等技术，控制沙盒内可见的文件和目录。
- **权限控制**：限制沙盒内进程的权限（如禁止 `chown`）。
- **命名空间隔离**：隔离网络、进程间通信（IPC）等资源。

`mkosi-sandbox`用于在沙箱中执行命令：
```
mkosi-sandbox [选项] [命令] [参数]
```
命令默认为`bash`。

接受的选项有：
- `--tmpfs 目录`：在沙箱中创建Tmpfs内存临时目录（退出后数据消失）。
- `--dev 目录`：将宿主环境的Devfs映射到到沙箱中的指定目录。
- `--proc 目录`：将宿主环境的Procfs映射到到沙箱中的指定目录，让沙盒内的程序能看到宿主机的进程列表（但无法直接操作）。
- `--dir 目录`：在沙箱中递归创建指定目录。
- `--bind|--bind-try|--ro-bind|--ro-bind-try **<宿主机目录> <沙盒目录>**`：将宿主环境的目录（可读写|只读|尝试挂在）绑定挂载到沙箱的目录。
- `--symlink 路径 链接`：在沙箱中创建软链接。
- `--write 数据 路径`：在沙箱中写入指定文件。
- `--overlay-lowerdir 主机目录`：设置下一个Overlayfs的下层目录。（通常是系统根目录 `/`）
- `--overlay-upperdir 主机目录|tmpfs`：设置下一个Overlayfs的上层目录。（用于保存沙盒内的修改）
- `--overlay-workdir 主机目录`：设置下一个Overlayfs挂载的工作目录（必须与 `upperdir` 在同一磁盘）。
- `--overlay 沙箱目录`：在沙箱中挂载Overlayfs。将合并后的视图挂载到沙盒目录（底层只读 + 上层可写）。
- `--unsetenv 变量名`：在沙箱中去掉环境变量。
- `--setenv 变量名 值`：在沙箱中设置环境变量。
- `--chdir 目录`：启动沙箱时的工作目录。
- `--same-dir`：启动沙箱时的工作目录为当前宿主机所处的目录。
- `--become-root`：成为沙箱内的Root用户并获取`CAP_SYS_ADMIN`，默认为普通用户。
- `--suppress-chown`：禁止使用`chown()`系统调用。
- `--unshare-net`：隔离网络命名空间。
- `--unshare-ipc`：隔离IPC命名空间。
- `--pack-fds`：将继承的文件描述符打包暴露到`$LISTEN_FDS`环境变量中。
#### **1. `upperdir` 的作用**

- **保存修改**：当沙盒内修改 `lowerdir` 中的文件时，OverlayFS 会将修改后的文件副本写入 `upperdir`。
- **记录删除**：当沙盒内删除 `lowerdir` 中的文件时，OverlayFS 会在 `upperdir` 中创建一个“白名单（whiteout）”标记该文件已删除。

#### **2. `workdir` 的作用**

- **原子操作**：OverlayFS 需要 `workdir` 来处理文件的创建、重命名和删除操作，确保这些操作是原子的（要么全部成功，要么全部失败）。
- **跨磁盘问题**：若 `upperdir` 和 `workdir` 不在同一磁盘，文件系统无法保证原子性，可能导致数据损坏或操作失败。

move命令，只涉及修改索引。图

实例：
```bash
#示例 1：完全映射根目录（危险但有权限）
mkosi-sandbox --bind / / --same-dir --become-root bash --login
```
- **作用**：  
    将宿主机整个根目录 `/` **可读写**绑定挂载bindmount到沙盒，以 root 身份运行 `bash`。在docker叫映射。
- **风险**：  
    沙盒内的操作会直接影响宿主机系统文件（适合调试或紧急修复，但需谨慎）。
- **选项详解**：
    - `--bind / /`：将宿主机根目录映射到沙盒根目录。
    - `--same-dir`：沙盒启动时的当前目录与宿主机一致。
    - `--become-root`：以 root 权限运行。

```
#示例 2：构建最小化根环境
mkosi-sandbox \
    --ro-bind /usr /usr \          # 只读映射系统程序库
    --symlink usr/bin /bin \       # 创建符号链接 /bin → usr/bin
    --symlink usr/lib /lib \       # 创建符号链接 /lib → usr/lib
    --symlink usr/lib64 /lib64 \   # 创建符号链接 /lib64 → usr/lib64
    --symlink usr/sbin /sbin \     # 创建符号链接 /sbin → usr/sbin
    --dev /dev \                   # 映射设备文件
    --proc /proc \                 # 映射进程信息
    --tmpfs /tmp \                 # 创建临时目录
    --become-root \                # 以 root 运行
    id                             # 执行命令：查看当前用户信息

```
#### **示例：沙盒内修改文件的过程**
```bash
# 宿主机目录结构（挂载前）
/home/user/
├── lower/        # 底层只读（模拟系统根目录）
│   └── etc/
│       └── passwd  # 原始文件内容：`root:x:0:0:root:/root:/bin/bash`
├── upper/        # 上层可写（初始为空）
└── work/         # 工作目录（初始为空）


# 挂载 OverlayFS 到沙盒的 /etc 目录
mkosi-sandbox \
    --overlay-lowerdir /home/user/lower \
    --overlay-upperdir /home/user/upper \
    --overlay-workdir /home/user/work \
    --overlay /etc \  #合并的视图包括：底层/etc，上层可写层，和工作目录（工作目录是临时层）
    bash
# 沙盒内执行
echo "new-data" > /etc/passwd # 在宿主机的/home/user/upper存在
```
- **底层文件**：`/home/user/lower/etc/passwd` **未被修改**。
- **上层目录**：在 `/home/user/upper/etc/` 中生成新的 `passwd` 文件。
- **合并视图**：沙盒内的 `/etc/passwd` 显示为 `new-data`，而宿主机的文件保持不变。

