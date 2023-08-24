-----
title: Binance connect: security
cover: https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9ZHsW37urweu-Y-2A8iyDg.jpeg
tag: binance
text: To prevent loss or freezing funds we take a lot of security measures. In this article, will discuss the main of them.
timeToRead: 5 min
date: 03.07.2023
-----


## Intro
To move funds between Binance and crypto wallet uses API key, which the user creates during connection.
To prevent loss or freezing funds we take a lot of security measures. In this article, will discuss the main of them.


![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*9ZHsW37urweu-Y-2A8iyDg.jpeg)



## 📦 Keys storing
The first level of security is an API key storage. It never transferred to a backend and is only stored on the phone. On iPhones, [API](https://www.binance.com/en/blog/community/how-to-use-an-api-key-securely-5-tips-from-binance-8638066848800196896) key is stored in [Apple keychain](https://support.apple.com/en-us/HT204085) — safe storage which has never been hacked, even on stolen iPhones.

## ☑️ White list of addresses
With API key you can transfer money only between Binance and your crypto wallet. If the key is lost but you keep [seed phras](https://worldcoin.org/articles/what-is-seed-phrase) safe, an intruder will only be able to transfer money between your accounts, but won’t be able to withdraw it.

## 📨 Proxy server
All requests to Binance could pass only from one IP address — via HERE proxy server. Requests can’t be changed as they are signed with a secret API key which is stored locally on the phone.

However, as the requests can come only from one IP address, we can skip a request if it looks suspicious to us. Our proxy server monitors daily limits and does not let suspicious transactions through.

## 👨‍💻 Team
HERE is a US company that is subject to regulation. Any breach of the user agreement or exposure of user funds will result in serious consequences for the team. We are reassured on all counts and designed the product so as not to touch users’ money in any way. All updates are reviewed by our CTO and we go through security [audits](https://docs.herewallet.app/technology-description/readme/security-audit) as the project evolves.

This is only part of the security measures we take, but the most important thing you can do is to keep the seed phrase safe. We take care of the rest 🤝

Join our community:
> [**Discord**](https://discord.gg/AfB5cvtFXH)
> [**Twitter**](https://twitter.com/here_wallet)
> [**AwesomeNEAR**](https://awesomenear.com/here-wallet)
> [**Telegram**](https://t.me/herewallet)
> [**Telegram chat**](https://t.me/herewalletchat)
> [**Medium**](https://medium.com/@nearhere)
> [**Website**](https://herewallet.app/)