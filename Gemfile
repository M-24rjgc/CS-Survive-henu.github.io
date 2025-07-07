source 'https://rubygems.org'

# GitHub Pages兼容配置
gem "github-pages", group: :jekyll_plugins
gem "webrick", "~> 1.7"

# Windows和JRuby不包含zoneinfo文件，所以打包tzinfo-data gem
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# 在Windows上监视目录的性能增强器
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
