# 🔐 ToolKiwi Password Manager

[![Last Version](https://img.shields.io/github/v/tag/toolkiwi/passwordmanager?style=flat&label=Last%20Version)](https://github.com/toolkiwi/passwordmanager/tags)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fpassword.toolkiwi.com&label=Website)
[![Docker Pulls](https://img.shields.io/docker/pulls/shiftytab/passwordmanager)](https://hub.docker.com/r/shiftytab/passwordmanager)
[![Contributors](https://img.shields.io/github/contributors/toolkiwi/passwordmanager)](https://github.com/toolkiwi/passwordmanager/graphs/contributors)
[![Made with ❤️ by Toolkiwi](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20by-Toolkiwi-red)](https://toolkiwi.com)

**PTK** is a serverless password manager that runs entirely offline. Your data never leaves your browser, period.

No cloud storage. No user accounts. No tracking pixels. Just you, your passwords, and some solid encryption.

Give it a spin here:  
👉 [https://password.toolkiwi.com](https://password.toolkiwi.com)

Want to see it in action first? Load up the demo vault using password **`demo`**:  
📂 [Download Demo Vault (.ptk)](https://toolkiwi.com/wp-content/uploads/2025/05/Demo-Vault-05-05-2025-1416.ptk)

---

## ✨ What makes PTK different

- 🔒 **Everything stays local** — AES encryption happens right in your browser, no servers involved
- 🧠 **Built-in 2FA codes** — manage your TOTP codes without juggling extra apps
- 💼 **Take your vault anywhere** — export to an encrypted `.PTK` file you can open on any device
- 🌍 **Works offline** — no internet? No problem
- 🧰 **Dead simple interface** — we kept it clean and straightforward
- 🧱 **Fully open source** — peek under the hood anytime you want
- 🐳 **Self-host friendly** — spin up your own instance with Docker in seconds

---

## 💡 Who is this for?

PTK works great whether you're tech-savvy or just want something that works:

- **Managing personal passwords:** Keep everything organized and accessible, even when you're offline.
- **Sharing credentials securely:** Need to send login info to a client or teammate? Just share an encrypted `.PTK` file and the master password.
- **Working in security-conscious environments:** No servers means no attack surface. Perfect for government, corporate, or high-privacy scenarios.
- **Going offline-first:** Manage passwords, notes, and 2FA codes without depending on the cloud.
- **Staying portable:** Since it runs in your browser or via Docker, you can use PTK pretty much anywhere.

---

## 🚀 Running PTK locally with Docker

Want to self-host? Here's how:
```bash
docker run -d \
  -p 8080:80 \
  --name passwordmanager \
  shiftytab/passwordmanager:latest
```

Then head over to:  
👉 [http://localhost:8080](http://localhost:8080)

> Feel free to swap `8080` for whatever port you prefer.

---

## 🧱 Building from source

Prefer doing it yourself? No problem:
```bash
git clone https://github.com/toolkiwi/passwordmanager.git
cd passwordmanager
npm install
npm run build
```

---

## 🧰 How vault files work

Your vault lives in a `.PTK` file — basically an AES-encrypted container holding all your passwords and notes.

To open it, just load the file and enter your master password. That's it.

---

## 🔄 A few tips

- Back up your vault regularly (seriously, do this)
- Log out when you're done using it
- Keep your `.PTK` file and master password somewhere safe — lose them and your data's gone for good

---

## 🗺️ What's coming next

We're actively working on PTK. Check out what's cooking:

📜 **Changelog:**  
[https://changelog.toolkiwi.com/ptk](https://changelog.toolkiwi.com/ptk)  

🗂️ **Feature roadmap:**  
[https://trello.com/b/WZc2CZZ8/password-manager](https://trello.com/b/WZc2CZZ8/password-manager)

---

## 💡 Why we built this

We believe web tools should be ethical, transparent, free, and respectful of your privacy. No data mining, no third-party trackers, no bullshit.

PTK is part of our commitment to building software that puts you first.

---

## 🧑‍💻 Want to contribute?

We'd love your help! Whether it's reporting bugs, suggesting features, or submitting pull requests, all contributions are welcome.

---

## 📄 License

PTK is licensed under the **Apache 2.0 License**.  
Check out the [LICENSE](./LICENSE) file or the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for the full details.

---

### 🌟 Like what we're doing?

Here's how you can help:
- ⭐ Star the repo on GitHub
- 🐋 Pull the Docker image and give it a try
- 💬 Share your thoughts or report issues on [GitHub](https://github.com/toolkiwi/passwordmanager/issues)

---

**→ [Try it now](https://password.toolkiwi.com) • [View on GitHub](https://github.com/toolkiwi/passwordmanager) • [Docker Hub](https://hub.docker.com/r/shiftytab/passwordmanager)**
