# MKOSI-INITRD
`mkosi-initrd`是使用MKOSI进行Initrd构建的工具。
```
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

# MKOSI-ADDON
使用MKOSI构建UKI插件的工具。它会包含当前系统环境中的`/etc/crypttab`中标记为`x-initrd.attach`的条目，以及`/etc/kernel/cmdline`的内容。
```
mkosi-addon [选项]
```
可用选项有：
- `--kernel-version=`：使用的内核版本，默认使用`$(uname -r)`。
- `-o|--output=`：输出文件名前缀，默认为`initrd`。
- `-O|--output-dir=`：输出的目录，默认为工作目录。
- `--debug-sandbox`：使用`strace`运行`mkosi-sandbox`。

# MKOSI-SANDBOX
`mkosi-sandbox`用于在沙箱中执行命令：
```
mkosi-sandbox [选项] [命令] [参数]
```
命令默认为`bash`。

接受的选项有：
- `--tmpfs 目录`：在沙箱中创建Tmpfs。
- `--dev 目录`：将宿主环境的Devfs映射到到沙箱中的指定目录。
- `--proc 目录`：将宿主环境的Procfs映射到到沙箱中的指定目录。
- `--dir 目录`：在沙箱中递归创建指定目录。
- `--bind|--bind-try|--ro-bind|--ro-bind-try 宿主目录 沙箱目录`：将宿主环境的目录（只读）绑定挂载到沙箱的目录。
- `--symlink 路径 链接`：在沙箱中创建软链接。
- `--write 数据 路径`：在沙箱中写入指定文件。
- `--overlay-lowerdir 主机目录`：设置下一个Overlayfs的下层目录。
- `--overlay-upperdir 主机目录|tmpfs`：设置下一个Overlayfs的上层目录。
- `--overlay-workdir 主机目录`：设置下一个Overlayfs挂载的工作目录。
- `--overlay 沙箱目录`：在沙箱中挂载Overlayfs。
- `--unsetenv 变量名`：在沙箱中去掉环境变量。
- `--setenv 变量名 值`：在沙箱中设置环境变量。
- `--chdir 目录`：启动沙箱时的工作目录。
- `--same-dir`：启动沙箱时的工作目录为当前宿主机所处的目录。
- `--become-root`：成为沙箱内的Root用户并获取`CAP_SYS_ADMIN`，默认为普通用户。
- `--suppress-chown`：禁止使用`chown()`系统调用。
- `--unshare-net`：隔离网络命名空间。
- `--unshare-ipc`：隔离IPC命名空间。
- `--pack-fds`：将继承的文件描述符打包暴露到`$LISTEN_FDS`环境变量中。

实例：
```
mkosi-sandbox --bind / / --same-dir --become-root bash --login
```
```
mkosi-sandbox \
    --ro-bind /usr /usr \
    --symlink usr/bin /bin \
    --symlink usr/bin /bin \
    --symlink usr/lib /lib \
    --symlink usr/lib64 /lib64 \
    --symlink usr/sbin /sbin \
    --dev /dev \
    --proc /proc \
    --tmpfs /tmp \
    --become-root \
    id
```

# MKOSI
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

## 安装
`mkosi`在各大发行版的软件源中有提供：
```
# Debian
apt install mkosi

# RHEL
dnf install mkosi
```
也可以使用`pip`安装：
```
pipx install git+https://mirror.ghproxy.com/https://github.com/systemd/mkosi.git
```
提示：`pipx`安装的程序在`venv`中运行，因此不可以使用系统Python解释执行。

## 语法
```
mkosi [选项] 子命令
```

## 构建配置文件
`mkosi`的任何命令都基于特定的规则读取配置文件，优先级顺序分别是：
- 最优先：命令行选项。
- 当前目录下的`mkosi.local.conf`配置文件和`mkosi.local`目录下的配置文件。该文件仅用于本地配置，不应该共享。
- `-C|--directory=`指定目录（默认为当前目录）下的`mkosi.conf`配置文件。
- `--directory=`指定目录（默认为当前目录）下的`mkosi.conf.d/`目录内的配置文件。
- 用户指定的Profile对应的`mkosi.profiles/`里面的子目录配置。
- `mkosi.images/`里面的子镜像的配置。

## 子命令
`mkosi`由多种子命令组成，这些命令其实都是一些外部工具的简易接口，它们大部分支持通过`--`分隔传递一些含有特殊意义的参数：
- `summary`：打印配置文件中定义的配置总结，这也反映了构建时会进行的操作。
- `build`：从配置文件中读取配置并开始构建镜像。
	- `--`之后的命令行参数会被传递给`mkosi.build`脚本。
- `sysupdate`：执行`systemd-sysupdate`，其中，`--transfer-source=`设为输出目录（默认为`mkosi.output/`），`--definition=`设为`SysupdateDirectory=`的值（默认为`mkosi.sysupdate/`）。
    - 要求：MKOSI使用的Sysupdate配置中，必须设置`PathRelativeTo=explicit`和`Path=/`才能正常使用`sysupdate`子命令进行更新，这会使得配置中的`Path=`使用`mkosi.output/`（或`OutputDirectory=`指定的目录）作为根。
    - （[v27以后不再需要](https://github.com/systemd/mkosi/pull/3515)）这同时也意味着，`SplitArtifacts=partitions`必须启用以对分区进行更新，而且更新内容（分区镜像文件、EFI程序、Initrd）文件名必须与Sysupdate配置中的`MatchPattern=`匹配。
	- `--`之后的命令行参数会被传递为`systemd-sysupdate`的额外参数。
- `shell`：（如果还没有构建）先构建镜像，然后调用`systemd-nspawn`Chroot到镜像内。
	- 仅适用于`QCow2=no`且未压缩的镜像。
	- `--`之后的命令行参数会被在镜像中执行。
- `boot`：（如果还没有构建）先构建镜像，然后调用`systemd-nspawn`以容器形式启动镜像。
	- 仅适用于`QCow2=no`且未压缩的镜像。
	- `--`之后的命令行参数会被传递为执行的命令行。
- `vm`：（如果还没有构建）先构建镜像，然后调用`qemu`或`systemd-vmspawn`以虚拟机形式启动镜像。
	- 对于目录树，MKOSI使用`virtiofsd`引导。
	- 任何`--`之后的命令行参数都会作为命令行参数被传递给`qemu`或`systemd-vmspawn`。
- `serve`：（如果还没有构建）先构建镜像，然后调用内置的HTTP服务器在`8081`端口上暴露工作目录。
- （仅用于`disk`镜像）`burn 块设备`：（如果还没有构建）先构建镜像，然后将镜像扩展到目标块设备的大小，再烧录到指定的块设备上。
- `genkey`：创建密钥。
- `ssh`：对于`Ssh=yes`的镜像，通过`ssh`连接到镜像中。
	- `--`之后的命令行参数会被传递为`ssh`的额外参数。
- `journalctl`：获取镜像内的日志。
	- `--`之后的命令行参数会被传递为`journalctl`的额外参数。
- `coredumpctl`：获取镜像内的内核转储文件。
	- `--`之后的命令行参数会被传递为`coredumpctl`的额外参数。
- `sandbox`：在构建沙箱中执行命令。
	- `--`之后的命令行参数会被传递为执行的命令行。
- `clean`：清理之前的构建产品。
- `bump`：刷新`mkosi.version`文件中的镜像版本。
- `genkey`：生成安全启动密钥。

## 命令行选项
这里提到的命令行选项是和构建配置完全无关的：
- `-f|--force`：进行指定操作前，不加分辨地重新构建镜像。
- `-R|--run-build-scripts`：仅仅只执行`mkosi.build`脚本（类似于`Format=none`的行为）。
- `-B--auto-bump`：执行操作后自动刷新版本号。
- `-C|--directory=`：指定工作目录，默认为当前工作目录。
- `--debug`：启用Debug级输出。
- `--debug-shell`：执行操作失败时，在`/work/src`目录下启动一个Debug Shell用于排错。
- `--debug-workspace`：执行操作失败时，当前工作空间的内容不会删除。
- `--debug-sandbox`：使用`strace`运行`mkosi-sandbox`。

## 构建配置
构建配置文件符合`.ini`格式，每一行都是`Key=Value`的形式，每一个配置项都有等价的命令行选项，转换方式是`SomeSetting`到`some-setting`。路径配置在使用相对路径时，取相对于该配置文件本身所在目录的路径。

配置中存在以下可用的占位符：

|含义|占位符|
|-|-|
|`Distribution=`|`%d`|
|`Release=`|`%r`|
|`Architecture=`|`%a`|
|`Format=`|`%t`|
|`Output=`|`%o`|
|`OutputDirectory=`|`%O`|
|`ImageId=`|`%i`|
|`ImageVersion=`|`%v`|
|`Profiles=`|`%p`|
|配置文件所在目录|`%C`|
|工作目录|`%P`|
|MKOSI的执行目录|`%D`|
|当前镜像的镜像名|`%I`|

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

### `[Validation]`段
- `SecureBoot=`：是否启用安全启动，这会影响是否对UKI进行签名。
    - `SecureBootKey=`：使用的安全启动PEM密钥。默认使用`mkosi.key`。
    - `SecureBootCertificate=`：使用的安全启动X509证书。默认使用`mkosi.crt`。
    - `SecureBootSignTool=`：为PE文件进行安全启动签名的程序，可选`systemd-sbsign`、`sbsign`或`auto`。
- `SecureBootAutoEnroll=`：是否自动导入安全启动的Key。
    - 这仅对虚拟机生效，如果希望对物理机生效，在Extra Tree中包含`/efi/loader/loader.conf`文件，并写入`secure-boot-enroll force`或`secure-boot-enroll manual`。
- `Verity=`：是否为扩展镜像启用Verity，可选值有`signed`、`hash`、`defer`、`auto`或布尔值。
    - 如果设为`signed`或`yes`，那么必须提供`VerityKey=`和`VerityCertificate=`，从而让镜像在构建时创建独立的签名分区，否则构建会失败。
    - 如果设为`hash`，那么MKOSI会启用Verity，但是不会在镜像中创建签名分区。
    - 如果设为`defer`，那么MKOSI会启用Verity，在镜像中预留出签名分区的空间，但是不实际创建。
    - 如果设为`no`，那么MKOSI会禁用Verity。
    - 如果设为`auto`，那么MKOSI会在提供了提供`VerityKey=`和`VerityCertificate=`时启用Verity并转为`signed`模式，否则禁用Verity。这是默认值。
    - `VerityKey=`：用于为Verity设备签名的PEM密钥。默认使用`mkosi.key`。
    - `VerityCertificate=`：用于为Verity设备签名的X509证书。默认使用`mkosi.crt`。
- `SignExpectedPcr=`：使用`systemd-measure`在UKI中包含PCR（平台配置寄存器）的签名，可选布尔值或`auto`，如果设为`auto`（默认值），那么会根据`systemd-measure`的存在性判断是否包含签名。
    - `SignExpectedPcrKey=`：签名使用的PEM密钥。默认使用`mkosi.key`。
    - `SignExpectedPcrCertificate=`：签名使用的X509证书。默认使用`mkosi.crt`。
- `Passphrase=`：LUKS加密的密钥文件，必须是600权限位，它应当保存完整的LUKS密钥，以一个换行结尾（即`/etc/crypttab`文件的格式）。
	- 也可以选择在工作目录下创建`mkosi.passphrase`文件。
- `Checksum=`：指定镜像的校验码。
    - `Sign=`：是否用`gpg`给校验码签名。默认为否。
    - `OpenPGPTool=`：签名使用的OpenPGP实现，默认为`gpg`，可选值有`sqop`、`rsop`。
    - `Key=`：给校验码签名的密钥。

### `[Runtime]`段
通用：
- `Register=`：是否向`systemd-machined`注册，以允许通过`machinectl`进行管理，默认启用。
- `Machine=`：机器名，用于`systemd-machined`注册的名称。
- `Credentials=`：启动时传递给镜像中的systemd的系统凭据。
- `Ephemeral=`：是否将镜像设为暂态，所有操作在关闭之后都会撤销。
- `RuntimeTrees=`接受逗号分隔的，冒号绝对路径对。前者是主机上的路径，后者是虚拟机内的路径，如果没有后面的部分，则自动挂载在`/root/src`目录下。
- `RuntimeSize=`：将镜像在启动时扩大到指定大小。
- `RuntimeNetwork=`：使用的网络模式，可选值有`user`、`interface`或`none`。`interface`依赖systemd-networkd配置网络接口。默认值为`user`。
- `RuntimeBuildSources=`：挂载指定的源代码目录到虚拟机内的`/work`目录下。
- `RuntimeHome=`：是否挂载主机的家目录到虚拟机的`/root`。
- `RuntimeScratch=`：是否在`/var/tmp`下挂载额外的空间。可选值为布尔值或`auto`。
- `SshKey=`：使用的SSH私钥。
- `SshCertificate=`：使用的SSH证书。
- `ForwardJournal=`：是否将容器或虚拟机的日志发送到宿主机。
- `SysupdateDirectory=`：`mkosi sysupdate`使用的配置目录，默认使用`mkosi.sysupdate/`。
    - MKOSI使用的Sysupdate配置必须设置`PathRelativeTo=explicit`和`Path=/`才能正常使用`sysupdate`子命令进行更新，这会使得配置中的`Path=`使用`mkosi.output/`（或`OutputDirectory=`指定的目录）作为根。
    - 这同时也意味着，`SplitArtifacts=`必须启用以对分区进行更新，而且更新内容（分区镜像文件、EFI程序、Initrd）文件名必须与Sysupdate配置中的`MatchPattern=`匹配。
- `StorageTargetMode=`：是否在`serve`时使用`systemd-storagetm`提供镜像服务。可选值有`auto`或布尔值。如果设为`auto`，那么会自动检测`systemd-storagetm`的存在性，以及当前构建产品是否为`disk`格式，如果都满足时，才会启用。

容器配置：
- `NSpawnSettings=`：使用`systemd-nspawn`启动时，读取的`.nspawn`单元文件。
	- 默认使用`mkosi.nspawn`文件。
- `UnitProperties=`：传递给NSPawn的Scope属性。

所有虚拟机配置项都仅适用于使用`vm`启动的虚拟机：
- `VirtualMachineMonitor=`：使用的虚拟机超管，可选值有`qemu`或`vmspawn`。默认值为`qemu`。
- `Console=`：虚拟机终端的接入模式。可选值有：`interactive`交互文本终端，`read-only`只读的交互文本终端，`native`Qemu原生的交互文本终端，`gui`使用图形界面。
- `RAM=`：设置Qemu的内存。默认为2G。
- `KVM=`：是否启用KVM加速，默认为`auto`。
- `VSock=`：是否启用VSock，默认为`auto`。
- `VSockCID=`：VSock的连接ID，可选值有`hash`、`auto`或手动输入。
- `TPM=`：是否启用TPM，默认为`auto`。
- `CDROM=`：是否在Qemu中以CD形式读取镜像，默认禁用。
- `Removable=`：是否以可插拔形式接入根文件系统镜像，默认禁用。
- `Firmware=`：使用的Qemu固件，可选`uefi-secure-boot`、`uefi`、`bios`、`linux`、`auto`。默认值为`auto`，表示按顺序尝试使用`uefi-secure-boot`和`linux`。
	- `Linux=`：指定使用的Direct Boot Kernel。
	- `FirmwareVariables=`：设置UEFI固件中的变量。可选值有：`microsoft`导入Microsoft安全启动证书，`custom`手动导入`SecureBootCertificate=`指定的安全启动证书，其他文件可以通过`virt-fw-vars`工具生成。
- `Drives=`：添加的驱动器，格式为`ID:大小[:目录:选项]`。
- `QemuArgs`：配置空格或换行符分隔的Qemu原生参数。
- `KernelCommandLineExtra=`：通过Qemu传递的额外内核命令行参数。
    - 在Qemu中硬编码的额外内核命令行参数为（[mkosi/mkosi/qemu.py](https://github.com/systemd/mkosi/blob/main/mkosi/qemu.py)）：
        - `rw`
        - `systemd.wants=network.target`
        - `module_blacklist=vmw_vmci systemd.tty.term.hvc0=宿主机终端类型 systemd.tty.columns.hvc0=宿主机终端列数 systemd.tty.rows.hvc0=宿主机终端行数`
    - 除非明确地手动进行设置，否则存在以下内核命令行参数的默认值：
        - `ip=enc0:any ip=enp0s1:any ip=enp0s2:any ip=host0:any ip=none`
        - `loglevel=4`
        - `SYSTEMD_SULOGIN_FORCE=1`

### 分区
MKOSI会从`mkosi.repart/`或`RepartDirectories=`指定的目录中读取`systemd-repart`的配置文件，并据此对磁盘镜像进行分区。文件命名应当为`优先级-分区名.conf`，格式为：
```
[Partition]
Type=分区类型
Format=文件系统
# 是否精简化文件系统
Minimize=best|off|guess
SizeMinBytes=最小大小
SizeMaxBytes=最大大小
```

默认情况下，MKOSI使用以下内置配置：

`00-esp.conf`：
```
[Partition]
Type=esp
Format=vfat
CopyFiles=/boot:/
CopyFiles=/efi:/
SizeMinBytes=512M
SizeMaxBytes=512M
```
- 需要注意的是，`CopyFiles=`的源路径的根是构建中的镜像的根。

`05-bios.conf`：
```
[Partition]
# UUID of the grub BIOS boot partition which grubs needs on GPT to
# embed itself into.
Type=21686148-6449-6e6f-744e-656564454649
SizeMinBytes=1M
SizeMaxBytes=1M
```
`10-root.conf`：
```
[Partition]
Type=root
Format=<distribution-default-filesystem>
CopyFiles=/
Minimize=guess
```

## 资源目录
有以下相关的资源目录：
- `mkosi.conf.d/`：额外的MKOSI配置，可以是文件，也可以是子工作目录，子工作目录支持的内容和MKOSI的主工作目录完全一致（必须包含`mkosi.conf`文件）。
	- 如果使用文件的话，那么文件中的`[Match]`段仅对该文件生效。
	- 如果使用子工作目录的话，那么子工作目录中的`mkosi.conf`中的`[Match]`段对整个子工作目录生效。
- `mkosi.local/`：额外的本地MKOSI配置，可以是文件，也可以是子工作目录。
- `mkosi.skeleton/`或`mkosi.skeleton.tar`：在已经构建基本根文件系统，开始安装软件包之前，将文件/目录拷贝到镜像内。与`SkeletonTrees=`配置项有关。
- `mkosi.extra/`或`mkosi.extra.tar`：在安装软件包之后，将额外的文件/目录拷贝到镜像内。与`ExtraTrees=`配置项有关。
- `mkosi.pkgmngr/`或`mkosi.pkgmngr.tar`：在构建时配置包管理器，但是不将文件写入镜像。这可以作为在构建时手动配置软件包管理器的手段，如果需要包含到镜像中，应该使用`mkosi.skeleton/`或`mkosi.skeleton.tar`。
- `mkosi.nspawn`：`systemd-nspawn`读取的容器单元文件。与`NspawnSettings=`配置项有关。
- `mkosi.cache/`：构建时软件包管理器缓存的保存目录。与`CacheDirectory=`配置项有关。
- `mkosi.builddir/`：用于执行Out-of-Tree构建的构建目录。与`BuildDirectory=`配置项有关。
- `mkosi.rootpw`：镜像中Root用户的密码。文件必须具有0600或更低的权限位。与`RootPasswordFile=`配置项有关。
- `mkosi.passphrase`：LUKS加密使用的密码。文件必须具有0600或更低的权限位。与`PassphraseFile=`配置项有关。
- `mkosi.crt`和`mkosi.key`：用于签名（UEFI SecureBoot、Verity等）的X.509证书和PEM私钥。与`SecureBootCertificate=`、`SecureBootKey=`、`VerityCertificate=`和`VerityKey=`配置项有关。
- `mkosi.output/`：用于保存所有的构建产品。与`OutputDirectory=`配置项有关。
- `mkosi.credentials/`：额外的系统凭据。目录中的每个文件名将用作凭据名，文件内容成为凭据值。与`Credentials=`配置项有关。
- `mkosi.repart/`：用于`systemd-repart`的分区定义文件，这些文件在构建磁盘镜像时传递给`systemd-repart`。如果存在`mkosi.repart/`或是使用了`RepartDirectories=`，那么就不会使用任何默认的分区定义。与`RepartDirectories=`配置项有关。
- `mkosi.uki-profiles/`：额外的UKI配置文件。与`UnifiedKernelImageProfiles=`配置项有关。
- `mkosi.sync.d`、`mkosi.prepare.d`、`mkosi.build.d`、`mkosi.postinst.d`、`mkosi.finalize.d`、`mkosi.postoutput.d`、`mkosi.clean.d`：各种钩子脚本的保存目录，目录中的脚本应当以`.sh`为后缀，可以添加额外的`.chroot`后缀以在镜像内执行。
- `mkosi.pe-addons/`（已经废弃）：额外的PE插件的`ukify`配置文件。与`PeAddons=`配置项有关。

## 钩子脚本
钩子脚本如果在末尾添加了`.chroot`后缀（例如，`mkosi.postinst.chroot`），那么会Chroot到镜像中执行，否则会在宿主环境中执行。

注：
- “在宿主环境中”意味着使用宿主机提供的命令行工具。
- “在镜像中”意味着使用镜像中提供的命令行工具。

脚本中有以下可用变量（具体可参考[`__init__.py`](https://github.com/systemd/mkosi/blob/main/mkosi/__init__.py)的`run_*_scripts`函数）：

|Variable|含义|`configure`|`sync`|`prepare`|`build`|`postinst`|`finalize`|`postoutput`|`clean`|
|-|-|-|-|-|-|-|-|-|-|
|`$ARCHITECTURE`|镜像的架构|✓|✓|✓|✓|✓|✓|✓|✓|
|`$QEMU_ARCHITECTURE`|Qemu格式的架构，用于通过`qemu-system-$QEMU_ARCHITECTURE`获取Qemu程序|✓||||||||
|`$DISTRIBUTION`|镜像的发行版|✓|✓|✓|✓|✓|✓|✓|✓|
|`$DISTRIBUTION_ARCHITECTURE`|发行版格式的架构|✓|✓|✓|✓|✓|✓|✓|✓|
|`$RELEASE`|镜像的版本|✓|✓|✓|✓|✓|✓|✓|✓|
|`$PROFILES`|`Profiles=`中设置的配置文件，使用逗号分隔|✓|✓|✓|✓|✓|✓||✓|
|`$BUILDROOT`|当前正在构建的镜像的根目录，实际上是`/buildroot`|||✓|✓|✓|✓|||
|`$CACHED`|如果有可用的缓存，为`1`||✓|||||||
|`$CHROOT_SCRIPT`|当前正在执行的脚本相对于镜像根目录的路径，主要用于`mkosi-chroot`，实际上是`/work/build-script`|||✓|✓|✓|✓|||
|`$SRCDIR`|启动`mkosi`的路径，实际上是`/work/src`|✓|✓|✓|✓|✓|✓|✓|✓|
|`$CHROOT_SRCDIR`|执行`mkosi-chroot`以后，`$SRCDIR`所在的路径，实际上也是`/work/src`|||✓|✓|✓|✓|||
|`$BUILDDIR`|树外构建中间文件目录（`mkosi.builddir`）相对于镜像根目录的路径，实际上是`/work/build`|||✓|✓|✓|✓|||
|`$CHROOT_BUILDDIR`|执行`mkosi-chroot`以后，`$BUILDDIR`所在的路径，实际上也是`/work/build`||||✓|||||
|`$DESTDIR`|用于保存`mkosi.build`构建时生成的产品的目录，实际上是`/work/dest`，该目录仅在执行`mkosi.build`时存在，在`mkosi.build`脚本执行完成后会被拷贝到镜像的根文件系统||||✓|||||
|`$CHROOT_DESTDIR`|执行`mkosi-chroot`以后，`$DESTDIR`所在的路径，实际上也是`/work/dest`||||✓|||||
|`$OUTPUTDIR`|镜像构建产物的保存目录，实际上是`/work/out`，注意，在`mkosi.build`脚本中不可见|||||✓|✓|✓|✓|
|`$CHROOT_OUTPUTDIR`|执行`mkosi-chroot`以后，`$OUTPUTDIR`所在的路径，实际上也是`/work/out`|||||✓|✓|||
|`$PACKAGEDIR`|`PackageDirectories=`设定的本地软件包目录，实际上是`/work/packages`，`mkosi.build`脚本可以将产品软件包放到该目录|||✓|✓|✓|✓|||
|`$ARTIFACTDIR`|实际上是`/work/artifacts`，类似于`$PACKAGEDIR`，但是并非用于软件包管理器，而是用于`mkosi`内部使用的产品，例如手动构建的Initrd|||✓|✓|✓|✓|||
|`$WITH_DOCS`|是否设置了`WithDocs=`|||✓|✓|||||
|`$WITH_TESTS`|是否设置了`WithTests=`|||✓|✓|||||
|`$WITH_NETWORK`|是否设置了`WithNetwork=`|||✓|✓|✓|✓|||
|`$SOURCE_DATE_EPOCH`|如果设置了`SourceDateEpoch=TIMESTAMP`，那么会保存时间戳|||✓|✓|✓|✓||✓|
|`$MKOSI_UID`|调用`mkosi`的用户UID|✓|✓|✓|✓|✓|✓|✓|✓|
|`$MKOSI_GID`|调用`mkosi`的用户GID|✓|✓|✓|✓|✓|✓|✓|✓|
|`$MKOSI_CONFIG`|当前镜像配置的JSON||✓|✓|✓|✓|✓|✓|✓|
|`$IMAGE_ID`|`ImageID=`的值|✓|✓|✓|✓|✓|✓|✓|✓|
|`$IMAGE_VERSION`|`ImageVersion=`的值|✓|✓|✓|✓|✓|✓|✓|✓|

此外，以下命令可用：
- `mkosi-chroot`：一个封装的`chroot`，会自动Chroot到镜像内执行命令。
- 镜像对应的发行版的包管理器可用，你也可以使用`mkosi-install|remove|upgrade|reinstall`封装工具。
- `git`已经自动配置好`safe.directory=*`。
- `useradd`和`groupadd`已经自动配置好`--root=$BUILDROOT`。

## 执行流程
创建MKOSI构建沙箱：
1. 解析命令行选项。
2. 解析配置文件。
3. 在宿主环境中执行`mkosi.configure`脚本。
4. 检查当前用户是不是Root，如果当前用户不是Root，则尝试根据当前用户的SubUID和SubGID隔离用户命名空间。
5. 隔离挂载命名空间。
6. 只读化重新挂载各种目录，包括：
	 - `/usr`
    - `/etc`
    - `/opt`
    - `/srv`
    - `/boot`
    - `/efi`
    - `/media`
    - `/mnt`

开始构建镜像：
1. 拷贝Sandbox Tree（`mkosi.sandbox/`）中的文件到构建沙箱中。
2. 更新软件包元数据。
3. 在宿主环境中执行Sync脚本（`mkosi.sync`），
4. 拷贝Base Tree中的文件到镜像中。
5. 检查并尝试复用缓存镜像。
6. 拷贝一份包管理器元数据到镜像内。
7. 拷贝Skeleton Tree（`mkosi.skeleton/`）中的文件到镜像中。
8. 安装发行版基本文件（如果设置了`BaseTrees=`，则会跳过这一步）。
9. 安装发行版软件包。
10. 使用`final`命令行参数在宿主环境或镜像中执行`mkosi.prepare`脚本（如果`Format=none`且没有`mkosi.build`脚本的话，则会跳过）。
11. **如果存在`mkosi.build`脚本的话**，在镜像的Overlayfs中安装构建所需的软件包（`BuildPackages=`）。
12. **如果存在`mkosi.build`脚本的话**，使用`build`命令行参数，在已经安装了`BuildPackages=`的Overlayfs中执行`mkosi.prepare`脚本。
13. 如果存在对应的配置（`Incremental=`）的话，缓存该镜像（如果`Format=none`且没有`mkosi.build`脚本的话，则会跳过）。
14. 如果存在`mkosi.build`脚本的话，在已经安装了`BuildPackages=`的Overlayfs中执行`mkosi.build`脚本。
15. 如果`Format=none`的话，结束构建。
16. 拷贝构建脚本的产物（保存在`$DESTDIR`目录下）到镜像内。
17. 拷贝Extra Tree（`mkosi.extra/`）中的文件到镜像内。
18. 在宿主环境或镜像中执行`mkosi.postinst`脚本。
19. 写入配置项中配置的其他杂项文件。例如`Ssh=`、`Autologin=`和`MakeInitrd=`。
20. 安装`systemd-boot`，并按需配置（`SecureBoot=`）安全启动。
21. 执行`systemd-sysusers`。
22. 执行`systemd-tmpfiles`。
23. 执行`systemctl preset-all`。
24. 执行`depmod`。
25. 执行`systemd-firstboot`。
26. 执行`systemd-hwdb`。
27. 移除指定的软件包和文件（`RemovePackages=`、`RemoveFiles=`）。
28. 如果安装了SELinux Policy的话，执行SELinux Relabel。
29. 在宿主环境或镜像中执行`mkosi.finalize`脚本。
30. 如果存在对应的配置（`UnifiedKernelImages=`）的话，生成UKI镜像。
31. 导出产物到`mkosi.output/`。
32. 在宿主环境或镜像中执行`mkosi.postoutput`脚本。

## 最佳实践
1. 创建工作目录，并使用`mkosi.conf`和`mkosi.conf.d/*.conf`（或`mkosi.conf.d/*/mkosi.conf`）配置文件以固化构建信息。
2. 使用`mkosi.postinst.chroot`脚本在镜像中进行配置。
3. 使用`mkosi.extra`向镜像中传递额外文件。
4. 使用`mkosi.build.chroot`脚本进行构建，**这个脚本对镜像根文件系统的修改不会保留**。在脚本中使用`$DESTDIR`保存构建产物。
5. 缓存有两种维度：使用`mkosi.cache`目录进行软件包缓存，使用`Incremental=`进行增量构建。需要重建增量缓存时，使用`-ff`选项。
6. 要测试不同的内核命令行参数的效果，使用`KernelCommandLineExtra=`而不是重建镜像，以提高效率。
7. 可以在无特权的情况下构建磁盘镜像，但是容器文件系统仍然需要Root权限。
8. 在启用`SecureBoot=yes`时，可以执行`mkosi genkey`直接生成证书和密钥，也可以自己创建`mkosi.key`和`mkosi.crt`。你还可以使用`ShimBootloader=yes`以安装Shim。
9. 使用`BiosBootloader=grub`以为BIOS引导安装GRUB。
10. 使用`useradd -m -g $USER --password "$(openssl passwd -stdin -6 <<< '密码明文')"`添加一个普通用户。
11. 在Debian中`mkosi qemu`不可用，解决方案为执行`cp /usr/lib/tmpfiles.d/static-nodes-permissions.conf /etc/tmpfiles.d/static-nodes-permissions.conf`，修改`/dev/kvm`的权限位为`0666`。
12. 在非特权模式构建时，`chown()`调用是被禁用的（钩子脚本中没有禁用，要禁用，设置环境变量`MKOSI_CHROOT_SUPPRESS_CHOWN=1`），要解决该问题，使用SubUID：`unshare --map-auto --map-current-user --setuid 0 --setgid 0`。
13. 在你正式构建时，使用`WithRecommends=no`以安装弱依赖。
14. 在使用`dd`克隆产品镜像前，执行`truncate -s|--size=文件大小 镜像文件.img`以调整磁盘镜像大小。
15. MKOSI可以负责构建Initrd，因此一个没有Initrd构建工具的镜像是可能的。
    - 不过需要注意的是，MKOSI构建的Initrd中会使用systemd作为`/init`，这与使用MKOSI-INITRD构建的Initrd是一致的。
16. 使用`mkosi.profiles/`保存不同的镜像口味，使用`mkosi.conf.d/`保存不同情况下的镜像配置，对于多种子场景的情况，将情况相对少且固定的子场景放在父目录（例如，输出格式为容器或VM），将情况相对较多且不固定的子场景放在子目录（例如，版本）。
17. 使用`Format=uki`和`MakeInitrd=no`来创建一个USI（Unified System Image，单个UEFI PE形式的完整系统）。
18. 在构建自定义发行版时，使用`mkosi.skeleton/`提供最小化的根文件系统，然后使用`mkosi.prepare.chroot`脚本安装软件包。
19. 如果希望通过`mkosi.configure`脚本动态修改配置，使用`jq`从标准输入获取JSON，然后进行修改：`jq -Mc '. += {"配置项": "值"}'`，打印到标准输出即可。
20. 要构建源代码，在`BuildPackages=`中添加构建需要的软件包，然后用`BuildSources=`提供源代码，在`mkosi.prepare`脚本中安装动态的构建时依赖（在命令行参数为`final`时在镜像中安装，在命令行参数为`build`时在构建Overlayfs中安装），并使用`mkosi.build`脚本执行构建，将产物保存到`$OUTPUTDIR`，通过`mkosi.postinst`脚本安装产物。对于`rpm`软件包来说，MKOSI有内置的构建配置，只需要将`BuildSources=`设置为`rpm`。

对于使用systemd的`kernel-install`的发行版来说，[MKOSI在构建时会自动跳过内核安装前后置Hook的执行](https://github.com/systemd/mkosi/pull/3566)，但是，Debian使用自己实现的Hook（位于`/etc/kernel/postinst.d/`和`/etc/kernel/postrm.d/`目录下），因此要跳过，创建脚本`mkosi.skeleton/etc/kernel/postinst.d/00disable`：
```
#!/bin/sh
set -ue

for hook in /etc/kernel/postinst.d/* /etc/kernel/postrm.d/*; do
    if [ "$(basename "${hook}")" = '00disabled' ]; then
        continue
    else
        cat << 'EOT' > "${hook}"
#!/bin/sh
set -ue

exit 0
EOT
    fi
done
```
以及脚本`mkosi.skeleton/etc/kernel/postrm.d/00disable`：
```
#!/bin/sh
set -ue

for hook in /etc/kernel/postrm.d/* /etc/kernel/postrm.d/*; do
    if [ "$(basename "${hook}")" = '00disabled' ]; then
        continue
    else
        cat << 'EOT' > "${hook}"
#!/bin/sh
set -ue

exit 0
EOT
    fi
done
```

## 发行版最小化构建

一些发行版的最小化构建软件包如下：

### Arch
```
[Content]
Packages=linux
         systemd
```

### Fedora
```
[Content]
Packages=kernel
         systemd
         systemd-boot
         udev
         util-linux
```

### CentOS/Rocky
```
[Content]
Packages=kernel
         systemd
         systemd-boot
         udev
```

### Debian
```
[Content]
Packages=linux-image-generic
         systemd
         systemd-boot
         systemd-sysv
         udev
         dbus
```

### Ubuntu
```
[Distribution]
Repositories=main,universe

[Content]
Packages=linux-image-generic
         systemd
         systemd-sysv
         udev
         dbus
```

### OpenSUSE
```
[Content]
Packages=kernel-default
         systemd
         udev
```

## 实例

### 构建一个Fedora容器镜像
使用命令行：
```
mkosi -d fedora -p kernel,systemd,systemd-udev,systemd-boot --format directory build
```
使用配置文件：
```
# mkosi.conf
[Distribution]
Distribution=fedora

[Output]
Format=directory

[Content]
Packages=kernel,systemd,systemd-udev,systemd-boot
```
然后执行：
```
mkosi build
```

### 构建一个Debian可引导磁盘镜像
使用配置文件：
```
# mkosi.conf
[Distribution]
Distribution=debian
Mirror=https://mirrors.tuna.tsinghua.edu.cn/debian
RepositoryKeyCheck=no

[Output]
Format=gpt_ext4
Qcow2=yes
Output=debian-12-minimal

[Content]
Bootable=yes
Packages=linux-image-generic
systemd
systemd-boot
systemd-sysv
udev
dbus
WithDocs=yes
CleanPackageMetadata=yes
WithUnifiedKernelImages=no
KernelCommandLine=console=ttyS0
Password=toor

[Partitions]
RootSize=10G
ESPSize=200M
BiosSize=1M

[Validation]
SecureBoot=no
```
然后执行：
```
mkosi build
```

### 构建Initrd
`mkosi.conf`：
```
[Output]
Format=cpio

[Content]
Packages=systemd
         udev
         kmod
```

### 构建一个USI（UEFI PE程序形式的完整系统镜像）
具体的精简方式见[Build USI](https://overhead.neocities.org/blog/build-usi-mkosi/)。

`mkosi.conf`：
```
[Distribution]
# 发行版
Distribution=arch

[Content]
# 不创建/etc/initrd-release，这会使systemd不以Initrd模式启动，也就是不会执行换根
MakeInitrd=no
# USI不需要安装任何Bootloader
Bootloader=none
# 该配置项实际上对构建不会造成任何实际影响，但是不禁用的话会导致检查更多程序依赖，比如depmod
Bootable=no
KernelCommandLine=rw
# 我们不希望交互式初始化，跳过Firstboot
Locale=
Keymap=
Timezone=
RootPassword=
Packages=
	base
	linux
	systemd
	linux-firmware
	intel-ucode
	amd-ucode
	iwd
	less
	nano
# 你可以考虑删除下列文件以释放空间
RemoveFiles=
    /usr/include            # 所有头文件
    /usr/share/pkgconfig    # 所有PKGCONFIG文件
    /usr/share/locale       # 所有Locale文件

[Output]
Format=uki
CompressOutput=zst
ImageId=example-usi
```
- 建议禁用`systemd-homed.service`、`systemd-userdbd.service`和`systemd-sysupdate.service`。

### 构建一个NetESP（纯网络启动镜像）
`mkosi.conf`：
```
[Distribution]
# 发行版
Distribution=arch

[Output]
Format=esp
ImageVersion=

[Content]
# 安装systemd-boot
Bootable=yes
# 只有systemd-boot
Packages=systemd-boot
```
`mkosi.extra/efi/loader/entries/netesp.conf`：
```
title NetBoot
architecture 架构
# 从别的地方下载UKI并启动
uki-url http://地址/UKI.efi
```
`mkosi.extra/efi/loader/loader.conf`：
```
timeout 3
```
思路：`systemd-boot`从远程服务器下载UKI，UKI中保存`systemd-import-generator`相关的内核命令行参数，同样从远程拉取Rootfs并启动，例如：
```
systemd.pull=raw,machine,verify=no,blockdev:rootdisk:http://地址/rootfs.raw root=gpt-auto
```

### 构建一个系统扩展镜像
`mkosi.conf`：
```
[Output]
# 如果不希望保留基础镜像的话，使用
# Format=none
Format=disk

[Content]
# 会拷贝到构建时的
BaseTrees=%O/base
```

`mkosi.images/base/mkosi.conf`（扩展镜像相对的基础镜像）：
```
[Output]
Format=directory
# 该镜像完全是个中间镜像
# 版本号在这里无意义
ImageVersion=

[Content]
# 该配置项在directory格式下实际上没有影响，但是会增加额外的依赖程序检测
Bootable=no
CleanPackageMetadata=no
Packages=systemd
         udev
```
- 除了文件存在包含关系（因为`BaseTrees=%O/base`）外，子镜像的配置和父镜像没有继承关系。**请务必注意，尤其是有关`Initrd`的配置**。

`mkosi.images/btrfs/mkosi.conf`
```
[Config]
Dependencies=base

[Output]
Format=sysext
Overlay=yes

[Content]
Bootable=no
# 注意这里选择base镜像的目录树作为BaseTree
BaseTrees=%O/base
Packages=btrfs-progs
```

### 构建一个用于NetESP
NetESP是用于网络启动的最小化ESP。
```
[Distribution]
# 发行版
Distribution=fedora

[Output]
Format=esp
# UEFI固件要求：磁盘镜像必须是.img后缀
OutputExtension=raw.img
ImageVersion=

[Content]
Packages=systemd-boot
```

### 构建一个Portable Service
`mkosi.conf`：
```
[Distribution]
# 发行版
Distribution=fedora

[Output]
Format=portable

[Packages]
BuildPackages=
    gcc
    make
```
`mkosi.build`：
```
#!/bin/sh -ue

# 构建代码
make all && \
make install

# 创建os-release
mkdir -p "$DESTDIR"/etc
cp -f /usr/lib/os-release "$DESTDIR"/etc/os-release
# 写入Portable镜像信息
cat << EOF >> "$DESTDIR"/etc/os-release 
PORTABLE_PRETTY_NAME="Example Portable Service"
EOF

# resolv.conf也必须存在
>| /etc/resolv.conf
```

### 构建一个不可变操作系统
首先创建一个如下分区的操作系统：

`00-esp.conf`：
```
[Partition]
Type=esp
Format=vfat
CopyFiles=/efi:/
CopyFiles=/boot:/
SizeMinBytes=1G
SizeMaxBytes=1G
```
`10-root-verity-sig.conf`：
```
[Partition]
Type=root-verity-sig
Label=%M_%A_verity_sig
Verity=signature
VerityMatchKey=root
SplitName=%t.%U
```
`11-root-verity.conf`：
```
[Partition]
Type=root-verity
Label=%M_%A_verity
Verity=hash
VerityMatchKey=root
SizeMinBytes=300M
SizeMaxBytes=300M
SplitName=%t.%U
```
`12-root.conf`：
```
[Partition]
Type=root
Format=erofs
Label=%M_%A_root
Verity=data
VerityMatchKey=root
CopyFiles=/
ExcludeFilesTarget=/var/
Minimize=yes
SplitName=%t.%U
```

除此之外我们还需要构建一个Initrd，Initrd中的`systemd-repart.service`的启动时间需要进行些许修改：

`mkosi.images/initrd/mkosi.conf`
```
[Include]
Include=mkosi-initrd
```
`mkosi.images/initrd/mkosi.extra/usr/lib/systemd/system/systemd-repart.service.d/sysroot.conf`：
```
[Unit]
After=sysroot.mount
ConditionDirectoryNotEmpty=|/sysroot/usr/lib/repart.d
```

为了进行AB更新，我们还需要在镜像中包含一些预设的分区配置：

`mkosi.extra/usr/lib/repart.d/00-esp.conf`：
```
[Partition]
Type=esp
```
`mkosi.extra/usr/lib/repart.d/10-root-verity-sig.conf`：
```
[Partition]
Type=root-verity-sig
Label=%M_%A_verity_sig
```
`mkosi.extra/usr/lib/repart.d/11-root-verity.conf`：
```
[Partition]
Type=root-verity
Label=%M_%A_verity
```
`mkosi.extra/usr/lib/repart.d/12-root.conf`：
```
[Partition]
Type=root
Label=%M_%A
SizeMinBytes=2G
SizeMaxBytes=2G
```
`mkosi.extra/usr/lib/repart.d/20-root-verity-sig.conf`：
```
[Partition]
Type=root-verity-sig
Label=_empty
```
`mkosi.extra/usr/lib/repart.d/21-root-verity.conf`：
```
[Partition]
Type=root-verity
Label=_empty
SizeMinBytes=300M
SizeMaxBytes=300M
```
`mkosi.extra/usr/lib/repart.d/22-root.conf`：
```
[Partition]
Type=root
Label=_empty
SizeMinBytes=2G
SizeMaxBytes=2G
```
`mkosi.extra/usr/lib/repart.d/30-swap.conf`：
```
[Partition]
Type=swap
Format=swap
Encrypt=tpm2
SizeMinBytes=4G
SizeMaxBytes=4G
```
`mkosi.extra/usr/lib/repart.d/40-var.conf`：
```
[Partition]
Type=var
Format=ext4
Encrypt=tpm2
SizeMinBytes=2G
```

因为`/etc`不可变，所以我们还需要在构建时提供Machine ID：
```
systemd-id128 new > mkosi.machine-id
```

最后为了未来镜像中的系统更新，我们还需要提供`systemd-sysupdate`的配置（你需要自行补充`[Source]`段）：

`mkosi.extra/usr/lib/sysupdate.d/10-root-verity-sig.transfer`：
```
[Transfer]
ProtectVersion=%A

[Target]
Type=partition
Path=auto
MatchPattern=%M_@v_verity_sig
MatchPartitionType=root-verity-sig
PartitionFlags=0
ReadOnly=1
```
`mkosi.extra/usr/lib/sysupdate.d/11-root-verity.transfer`：
```
[Transfer]
ProtectVersion=%A

[Target]
Type=partition
Path=auto
MatchPattern=%M_@v_verity
MatchPartitionType=root-verity
PartitionFlags=0
ReadOnly=1
```
`mkosi.extra/usr/lib/sysupdate.d/12-root.transfer`：
```
[Transfer]
ProtectVersion=%A

[Target]
Type=partition
Path=auto
MatchPattern=%M_@v
MatchPartitionType=root
PartitionFlags=0
ReadOnly=1
```
`mkosi.extra/usr/lib/sysupdate.d/20-uki.transfer`：
```
[Transfer]
ProtectVersion=%A

[Target]
Type=regular-file
Path=/EFI/Linux
PathRelativeTo=boot
MatchPattern=%M_@v+@l-@d.efi \
             %M_@v+@l.efi \
             %M_@v.efi
Mode=0444
TriesLeft=3
TriesDone=0
InstancesMax=2
```

### 构建一个不安全的`/usr`不可变操作系统
由于上文提到的原因（UKI必须使用Verity Hash对`/usr/`分区进行定位），我们无法让MKOSI在构建镜像时，自动向UKI中填充`/usr/`分区所在的位置，因此，我们必须手动在`mkosi.conf`中设置：
```
[Content]
# 要么根文件系统在Initrd中是可写的，要么存在/usr目录，否则会导致挂载失败
# 也可以使用mount.usr=PARTUUID
KernelCommandLine=rw mount.usr=PARTLABEL=%i_%v
```

`systemd-repart`配置如下：

`00-esp.conf`：
```
[Partition]
Type=esp
Format=vfat
CopyFiles=/efi:/
CopyFiles=/boot:/
SizeMinBytes=1G
SizeMaxBytes=1G
```

`10-usr.conf`：
```
[Partition]
Type=usr
# 注意这里，和内核命令行参数一致
Label=%M_%A
Format=erofs
CopyFiles=/usr:/
Minimize=yes
SplitName=%t.%U
```

此外，还需要在镜像内提供一些分区配置：

`mkosi.extra/usr/lib/repart.d/00-esp.conf`：
```
[Partition]
Type=esp
```

`mkosi.extra/usr/lib/repart.d/10-usr-verA.conf`：
```
[Partition]
Type=usr
Label=%M_%A
SizeMinBytes=5G
SizeMaxBytes=20G
Weight=2000
```

`mkosi.extra/usr/lib/repart.d/20-usr-verB.conf`：
```
[Partition]
Type=usr
Label=_empty
SizeMinBytes=5G
SizeMaxBytes=20G
Weight=2000
```

`mkosi.extra/usr/lib/repart.d/30-swap.conf`：
```
[Partition]
Type=swap
Format=swap
SizeMinBytes=4G
SizeMaxBytes=4G
```

`mkosi.extra/usr/lib/repart.d/40-root.conf`：
```
[Partition]
Type=root
Format=btrfs
SizeMinBytes=1G
Weight=20000
Subvolumes=/var
# 这是为了使systemd-journald使用持久模式
MakeDirectories=/var/log/journal
```

`mkosi.extra/usr/lib/repart.d/50-home.conf`：
```
[Partition]
Type=home
Format=btrfs
SizeMinBytes=1G
Weight=40000
```

我们还需要确保`/etc/`目录在启动时动态生成，因此需要：

`mkosi.extra/usr/lib/tmpfiles.d/etc.conf`：
```
# 仅作参考
# This overrides the same file from systemd since we want to symlink everything
# into /etc instead of copying so updates to /usr propagate properly.
L /etc/os-release - - - - ../usr/lib/os-release
# mtab needs to be refreshed on every boot.
L+ /etc/mtab - - - - ../proc/self/mounts
# Contains the default systemd locale
L /etc/locale.conf
L /etc/nsswitch.conf
L /etc/issue
L /etc/profile
# Required by pam_env plugin
L /etc/security
L /etc/bash.bashrc
L /etc/bash.bash_logout
# Canonical location to look for certificates
L /etc/ca-certificates
L /etc/debuginfod
L /etc/ssh
# Canonical location to look for certificates
L /etc/ssl
# Required by pam environment plugin
L /etc/environment
# Contains the archlinux keyring required to build images
L /etc/pacman.d
# Required to generate desktop environment application menus
L /etc/xdg
# Contains default font configuration
L /etc/fonts
# Configuration for man
L /etc/man_db.conf
# Configuration for ldconfig
L /etc/ld.so.conf
L /etc/ld.so.conf.d
# We NEED authselect to correctly login
L /etc/authselect
L /etc/sysconfig
```

为了确保`ldconfig.service`在`/etc/`目录生成后再启动，我们还需要：

`mkosi.extra/usr/lib/systemd/system/ldconfig.service.d/tmpfiles.conf`：
```
[Unit]
After=systemd-tmpfiles-setup.service
```

最后，我们需要MKOSI的更新配置：

`mkosi.sysupdate/10-usr.transfer`：
```
[Transfer]
ProtectVersion=%A

[Source]
Type=regular-file
Path=/
PathRelativeTo=explicit
MatchPattern=%M_@v.usr-%a.@u.raw

[Target]
Type=partition
Path=auto
MatchPattern=%M_@v
MatchPartitionType=usr
PartitionFlags=0
ReadOnly=1
```

`mkosi.sysupdate/20-uki.transfer`：
```
[Transfer]
ProtectVersion=%A

[Source]
Type=regular-file
Path=/
PathRelativeTo=explicit
MatchPattern=%M_@v.efi

[Target]
Type=regular-file
Path=/EFI/Linux
PathRelativeTo=boot
MatchPattern=%M_@v+@l-@d.efi \
             %M_@v+@l.efi \
             %M_@v.efi
Mode=0444
TriesLeft=3
TriesDone=0
InstancesMax=2
```

## 杂记

### ToolsTree的问题
如果使用了ToolsTree，而且镜像中存在`/usr/share/factory`，那么ToolsTree中必须也存在`/usr/share/factory`，否则会发生文件系统只读错误，这是因为ToolsTree的`/usr`[会被只读地绑定挂载到Sandbox中](https://github.com/systemd/mkosi/blob/main/mkosi/run.py#L503)，[这导致无法在ToolsTree中自动创建`/usr/share/factory`挂载点](https://github.com/systemd/mkosi/blob/main/mkosi/sandbox.py#L488)。

不过，该问题在[Commit `09497d0`](https://github.com/systemd/mkosi/commit/09497d0b15e2f7ec4e06813b4f7a8d26d237a7b6)中已被修复。