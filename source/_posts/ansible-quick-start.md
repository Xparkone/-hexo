---
title: "Ansible 快速上手指南"
date: 2026-07-27 14:08:30
description: "Ansible 快速上手指南——从核心原理到实际操作的完整技术笔记。"
categories:
  - 自动化运维
tags:
  - Ansible
  - 自动化
toc: true
---

面向有一定 Linux 基础的读者，从零学习 Ansible（ansible-core 2.14+）的实操文档与可运行示例。

## 文档

完整教程见：**[docs/ansible-usage-guide.md](docs/ansible-usage-guide.md)**

主要内容：安装与免密、Inventory、ad-hoc、Playbook、变量与模板、Handlers、Roles、Vault、完整 nginx 示例、排错与速查附录。

## 示例

`examples/nginx-site/`：批量安装 nginx、部署站点模板并启动服务。

```bash
cd examples/nginx-site
# 1. 编辑 inventory/hosts.ini，填入真实主机与用户
# 2. 确保 SSH 免密与 sudo 可用
ansible web -m ansible.builtin.ping
ansible-playbook site.yml --syntax-check
ansible-playbook site.yml --check --diff
ansible-playbook site.yml
```

## 版本

以 Ansible 2.14+ / ansible-core 为准。
