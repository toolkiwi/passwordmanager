# 🔐 ToolKiwi Password Manager

[![Last Version](https://img.shields.io/github/v/tag/toolkiwi/passwordmanager?style=flat&label=Last%20Version)](https://github.com/toolkiwi/passwordmanager/tags)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fpassword.toolkiwi.com&label=Website)
[![Docker Pulls](https://img.shields.io/docker/pulls/shiftytab/passwordmanager)](https://hub.docker.com/r/shiftytab/passwordmanager)
[![Contributors](https://img.shields.io/github/contributors/toolkiwi/passwordmanager)](https://github.com/toolkiwi/passwordmanager/graphs/contributors)
[![Made with ❤️ by Toolkiwi](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20by-Toolkiwi-red)](https://toolkiwi.com)

**PTK** is a **serverless password manager** that runs entirely **offline** — all your data stays securely in your browser.

💾 **No cloud. No account. No tracking. Just security and simplicity.**

You can try it out here:  
👉 [https://password.toolkiwi.com](https://password.toolkiwi.com)

To explore a demo vault, use the password **`demo`** with the following file:  
📂 [Download Demo Vault (.ptk)](https://toolkiwi.com/wp-content/uploads/2025/05/Demo-Vault-05-05-2025-1416.ptk)

---

## ✨ Features

- 🔒 **100% local encryption** (AES-based) — no server, no external API  
- 🧠 **TOTP support** — manage 2FA codes locally  
- 💼 **Portable vaults** — export your data to an encrypted `.PTK` file  
- 🌍 **Offline-first** — works without an internet connection  
- 🧰 **Simple UI** — familiar experience, minimal friction  
- 🧱 **Open Source** — transparent and auditable
- 🐳 **Docker-ready** — self-host your own instance easily  

---

## 💡 Use Cases

PTK is designed to be **flexible and practical** for a wide range of situations:

- **Personal password management:** Keep all your credentials safe, organized, and always accessible, even without internet.  
- **Secure client sharing:** Send login credentials, notes, or project information securely by sharing a single encrypted `.PTK` file with a master password.  
- **Work in sensitive environments:** With **no server and no cloud**, PTK ensures maximum privacy, making it ideal for governmental, corporate, or security-conscious workflows.  
- **Offline-first convenience:** Manage your accounts, notes, and TOTP codes without relying on online services.  
- **Portable and cross-platform:** Since everything runs in the browser or via Docker, you can use PTK on virtually any device.  

---

## 🚀 Try It Locally (Docker)

You can self-host PTK on your own machine or server using Docker:

```bash
docker run -d \
  -p 8080:80 \
  --name passwordmanager \
  shiftytab/passwordmanager:latest
```

Then open:  
👉 [http://localhost:8080](http://localhost:8080)

> 💡 You can change the port (`8080`) to any value you prefer.

---

## 🧱 Manual Build

If you prefer building manually:

```bash
git clone https://github.com/toolkiwi/passwordmanager.git
cd passwordmanager
npm install
npm run build
```

---

## 🧰 File Format

Your vault is saved in a `.PTK` file, an **AES-encrypted container** holding all your credentials and notes.

To unlock it, simply open the file and enter your **master password**.

---

## 🔄 Recommendations

- Export your vault regularly  
- Log out when you’re done  
- Keep your `.PTK` file and master password safe, they’re your keys  

---

## 🗺️ Roadmap

Follow the project’s progress and upcoming features:

📜 **Changelog:**  
[https://changelog.toolkiwi.com/ptk](https://changelog.toolkiwi.com/ptk)  

🗂️ **Trello Board:**  
[https://trello.com/b/WZc2CZZ8/password-manager](https://trello.com/b/WZc2CZZ8/password-manager)

---

## 💡 Philosophy

> Ethical, transparent, free, serverless, and third-party-free web tools — accessible to everyone.

PTK is part of a broader initiative to create tools that **respect privacy and digital freedom**.

---

## 🧑‍💻 Contributing

Contributions are welcome!  
Feel free to open issues, suggest features, or submit pull requests.

---

## 📄 License

This project is licensed under the **Apache 2.0 License**.  
See [LICENSE](./LICENSE) or [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for details.

---

### 🌟 Show your support

If you like the project, consider:
- ⭐ Starring the repository  
- 🐋 Pulling the Docker image  
- 💬 Sharing feedback on [GitHub](https://github.com/toolkiwi/passwordmanager/issues)

---

**→ [Try it now](https://password.toolkiwi.com) • [View on GitHub](https://github.com/toolkiwi/passwordmanager) • [Docker Hub](https://hub.docker.com/r/shiftytab/passwordmanager)**
