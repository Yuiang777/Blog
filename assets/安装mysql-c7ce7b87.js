const r=`检测失败的，后面加 --force --nodeps 不检测依赖，强制安装\r
\r
rpm -ivh  mysql-community-client-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
rpm -ivh  mysql-community-client-plugins-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
rpm -ivh  mysql-community-common-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
rpm -ivh  mysql-community-devel-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
 rpm -ivh  mysql-community-embedded-compat-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
rpm -ivh  mysql-community-libs-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
rpm -ivh  mysql-community-libs-compat-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
 rpm -ivh  mysql-community-server-8.0.26-1.el7.x86_64.rpm --force --nodeps\r
\r
rpm -ivh  mysql-community-test-8.0.26-1.el7.x86_64.rpm --force --nodeps       ！！！\r
\r
rpm -ivh \r
\r
 yum install openssl-devel\r
\r
\r
无法启动试试这条命令，systemctl start mysqld.service\r
\r
启动mysql服务\r
systemctl start MySQL //启动\r
		restart		//重启\r
		stop			//关闭\r
\r
\r
\r
cd /etc/sysconfig/network-scripts\r
\r
vi ifcfg-ens33  按下"i"或者"insert"键进入编辑模式。\r
\r
若已经开启了网卡还是存在该问题可以尝试配置下国内的dns。\r
\r
（1）输入命令 "vi /etc/resolv.conf" \r
\r
（2）添加 "nameserver 114.114.114.114" \r
\r
（3）保存后，重启系统或者重启网卡，输入命令 "reboot" 或 "service network restart"。\r
\r
若上述方法还是无效可以尝试修改CentOS-Base.repo中的地址\r
\r
（1）进入 "/etc/yum.repos.d" 。\r
\r
（2）编辑 "vi CentOS-Base.repo" 。\r
\r
（3）将所有的 "mirrorlist" 注释掉，将所有的 "baseurl" 取消注释。\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
阿里云镜像源\r
\r
curl -o /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo\r
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.re\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
\r
perl(Data::Dumper) 被 mysql-community-test-8.0.26-1.el7.x86_64 需要\r
        perl(JSON) 被 mysql-community-test-8.0.26-1.el7.x86_64 需要\r
        perl(Test::More) 被 mysql-community-test-8.0.26-1.el7.x86_64 需要\r
Sider Fusion\r
从你提供的信息来看，mysql-community-test 软件包需要一些 Perl 模块作为依赖项，但你的系统似乎缺少这些模块。这些模块包括：\r
\r
perl(Data::Dumper)\r
perl(JSON)\r
perl(Test::More)\r
要解决这个问题，你可以采取以下步骤来安装所需的 Perl 模块：\r
\r
1. 使用 YUM 安装缺失的 Perl 模块\r
在 CentOS 系统上，你可以使用 yum 来安装这些 Perl 模块。可以运行以下命令：\r
\r
bash\r
sudo yum install perl-Data-Dumper perl-JSON perl-Test-More  \r
2. 确保 CentOS 仓库已启用\r
确保你已经启用了 EPEL（Extra Packages for Enterprise Linux）仓库，因为某些 Perl 模块可能在这个仓库中。可以使用以下命令安装 EPEL：\r
\r
bash\r
sudo yum install epel-release  \r
之后，再次尝试安装所需的 Perl 模块。\r
\r
3. 运行 yum update\r
在安装这些模块之前，确保你的系统是最新的，这样可以减少依赖冲突的可能性。运行：\r
\r
bash\r
sudo yum update  \r
4. 检查其他仓库\r
如果你依然遇到问题，检查你的 /etc/yum.repos.d/ 目录，确认你是否有其他的仓库配置，可能有用来提供这些 Perl 模块的源。\r
\r
5. 安装 Perl 模块的方法有多种\r
如果通过 YUM 安装失败，可以使用 CPAN（Comprehensive Perl Archive Network）手动安装 Perl 模块：\r
\r
bash\r
sudo cpan Data::Dumper JSON Test::More  \r
6. 验证安装\r
在完成功能安装之后，你可以通过以下命令来检查这些模块是否存在：\r
\r
bash\r
perl -MData::Dumper -e 'print "Data::Dumper is installed\\n";'  \r
perl -MJSON -e 'print "JSON is installed\\n";'  \r
perl -MTest::More -e 'print "Test::More is installed\\n";'  \r
如果这些命令没有返回错误，则表示模块已成功安装。\r
\r
完成上述步骤后，重新尝试安装或更新 mysql-community-test 软件包。\r
\r
\r
\r
\r
安装 EPEL 仓库（如果尚未安装）：\r
\r
bash\r
sudo yum install epel-release  \r
安装 Perl 和 Test::More 模块：\r
使用 CPAN 来安装 Test::More：\r
\r
bash\r
sudo cpan Test::More  \r
如果你更倾向于使用 YUM，可以尝试：\r
\r
bash\r
sudo yum install perl-Test-Simple  \r
Test::More 是 perl-Test-Simple 的一部分，因此安装后应该会解决依赖。\r
\r
再次尝试安装 MySQL：\r
依赖安装完成后，重新运行之前的安装命令。\r
\r
\r
\r
两个命令都可以，执行完成后进入/etc/yum.repos.d`;export{r as default};
